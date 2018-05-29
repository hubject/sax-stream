var meta = require('./meta');

function addChild(parent, name) {
    var child = {};
    meta.setParent(child, parent);

    if (!parent[name]) {
        parent[name] = child;
    } else {
        if (!Array.isArray(parent[name])) {
            parent[name] = [parent[name]];
        }
        parent[name].push(child);
    }
    return child;
}

function addText(key, node, text) {
    var parent = meta.getParent(node);

    if (hasChilds(key, node) || !parent) {

        node.value = text;

    } else if (parent) {

        var target = parent[key];

        if (Array.isArray(target)) {

            var index = target.indexOf(node);
            target[index] = text;
        } else {

            parent[key] = text;
        }
    } else {
        return text;
    }

    return node;
}

function hasChilds(key, node) {
    var keys = Object.keys(node);
    var keyLength = keys.length;
    return keyLength && (keyLength > 1 || keys[0] !== key);
}

function concatText(key, node, text) {

    var value;

    if (typeof node === 'string') {
        value = node;
    } else if (node && 'value' in node) {
        value = node.value;
    } else {
        value = '';
    }

    addText(key, node, value + text);

    return node;
}

exports.hasChilds = hasChilds;
exports.addChild = addChild;
exports.addText = addText;
exports.concatText = concatText;
