const {Transform} = require('stream');
var util = require('util');
var sax = require('sax');
var elem = require('./elem');
var meta = require('./meta');
var debug = require('debug')('sax-stream');
var StringDecoder = require('string_decoder').StringDecoder;

exports.XmlNode = XmlNode;
exports.tags = tags = (handlerMap) => data => Object
    .keys(data)
    .forEach(key => typeof handlerMap[key] === 'function' && handlerMap[key](data[key]));

function XmlNode(options) {
    if (!(this instanceof XmlNode)) {
        return new XmlNode(options);
    }

    options.trim = true;

    Transform.call(this, {
        highWaterMark: options.highWaterMark || 350,
        objectMode: true
    });
    this.records = [];
    this.error = null;
    this.parser = this.createSaxParser(options);
    this.stringDecoder = new StringDecoder('utf8');
    this.preparePush = options.tags && options.tags.length > 1
        ? (record => ({[record.key]: record.value}))
        : (record => record.value);
}

util.inherits(XmlNode, Transform);

XmlNode.prototype.createSaxParser = function(options) {

    var self = this;
    var currentKey;
    var record;
    var parser = sax.parser(options.strict || false, prepareParserOptions(options));
    var isTargetTag = 'tag' in options ? function(name) {
        return options.tag === name;
    } : function(name) {
        return options.tags.indexOf(name) !== -1;
    };

    parser.onopentag = function(node) {
        currentKey = node.name;

        if (options.omitNsPrefix) currentKey = currentKey.split(':').pop();

        debug('Open "%s"', node.name);
        if (record) {
            record = elem.addChild(record, currentKey);
        }
        else if (isTargetTag(currentKey)) {
            record = {};
        }

        var attrKeys = Object.keys(node.attributes);

        if (record && attrKeys.length) {
            attrKeys.forEach(function(key) {

                var value = node.attributes[key];
                if (key in record) key = '_' + key;
                record[key] = value;
            });
        }
    };

    parser.onclosetag = function(tag) {
        debug('Closed "%s"', tag);
        var recordParent = meta.getParent(record);
        var currentKey = options.omitNsPrefix ? tag.split(':').pop() : tag;
        if (isTargetTag(currentKey) && !recordParent) {
            debug('Emitting record', record);

            if (!options.omitEmpty || elem.hasChilds(currentKey, record)) {

                // if record has only one value property,
                // use the property value as record
                var keys = Object.keys(record);
                if (keys.length === 1 && 'value' === keys.pop()) {
                    record = record.value;
                }

                self.records.push({key: currentKey, value: record});
            }
            record = undefined;
        } else if (record) {

            if (options.omitEmpty && !elem.hasChilds(currentKey, record) && !isString(currentKey, record)) {
                removeChild(currentKey, record);
            }

            record = recordParent;
        }
    };

    parser.ontext = function(value) {
        if (record) {
            elem.addText(currentKey, record, value);
        }
    };

    parser.oncdata = function(value) {
        if (record) {
            elem.concatText(currentKey, record, value);
        }
    };

    parser.onerror = function(err) {
        self.error = err;
    };

    parser.onend = function() {
        debug('onend - flushing remaining items');
        self.pushAll(self.callback);
        self.callback = null;
    };

    return parser;
};

XmlNode.prototype.pushAll = function(callback) {
    if (this.error) {
        callback(this.error);
        this.error = null;
        return;
    }
    debug('pushing %d', this.records.length);
    this.records.forEach(record => this.push(this.preparePush(record)));
    this.records.length = 0;
    callback();
};

XmlNode.prototype._transform = function(chunk, encoding, callback) {

    // For parsing multi-byte characters to and to
    // fix http://stackoverflow.com/a/12122668
    // a StringDecoder is necessary
    var str = this.stringDecoder.write(chunk);

    this.parser.write(str);
    this.pushAll(callback);
};

XmlNode.prototype._flush = function(callback) {
    var self = this;
    self.callback = callback;
    self.parser.close();
};

function removeChild(key, node) {

    var parent = meta.getParent(node);
    var target = parent[key];

    if (Array.isArray(target)) {
        var index = target.indexOf(node);
        if (index !== -1) {
            target.splice(index, 1);
        }
    } else {

        delete parent[key];
    }
}

function isString(key, node) {
    var parent = meta.getParent(node);
    return typeof parent[key] === 'string';
}

function prepareParserOptions(options) {
    return [
        'trim',
        'normalize',
        'lowercase',
        'xmlns',
        'position',
        'strictEntities',
        'noscript'
    ].reduce(function(opts, name) {
        if (name in options) {
            opts[name] = options[name];
        }
        return opts;
    }, {
        position: false
    });
}
