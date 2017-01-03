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

function addText(node, text) {

    var keyLength = Object.keys(node).length;

    if(keyLength > 0 && !(('parent' in node) && keyLength === 1)) {

        node.value = text;

    } else if(node.parent) {

        for(var key in node.parent) {
            if(node.parent[key] === node) {

                node.parent[key] = text;
            }
        }
    }

    return node;
}

function concatText(node, text) {

    var value;

    if(typeof node === 'string') {
        value = node;
    } else if(node && 'value' in node) {
        value = node.value;
    } else {
        value = '';
    }

    addText(node, value + text);

    return node;
}

exports.addChild = addChild;
exports.addText = addText;
exports.concatText = concatText;
