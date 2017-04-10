function addChild(parent, name) {
    var child = {
        parent: parent
    };

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

    if (hasChilds(node) || !node.parent) {

        node.value = text;

    } else if (node.parent) {

        var target = node.parent[key];

        if (Array.isArray(target)) {

            var index = target.indexOf(node);
            target[index] = text;
        } else {

            node.parent[key] = text;
        }
    } else {
        return text;
    }

    return node;
}

function hasChilds(node) {

    var keyLength = Object.keys(node).length;

    return keyLength > 0 && !(('parent' in node) && keyLength === 1);
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
