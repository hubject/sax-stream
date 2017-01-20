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

    var keyLength = Object.keys(node).length;

    if (keyLength > 0 && !(('parent' in node) && keyLength === 1)) {

        node.value = text;

    } else if (node.parent) {

        var target = node.parent[key];

        if (Array.isArray(target)) {

            var index = target.indexOf(node);
            target[index] = text;
        } else {

            node.parent[key] = text;
        }
    }

    return node;
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

exports.addChild = addChild;
exports.addText = addText;
exports.concatText = concatText;
