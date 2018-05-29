require('reflect-metadata');

var PARENT_META_KEY = 'sax-stream:parent';

exports.getParent = function(item) {
    if (item) {
        return Reflect.getMetadata(PARENT_META_KEY, item);
    }
};

exports.setParent = function(item, parent) {
    if (item) {
        Reflect.defineMetadata(PARENT_META_KEY, parent, item);
    }
};

exports.hasParent = function(item) {
    if (item) {
        return Reflect.hasMetadata(PARENT_META_KEY, item);
    }
    return false;
};