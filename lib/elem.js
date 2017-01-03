function child(el, path) {
    var name;

    if (!el) {
        return;
    }
    if (Array.isArray(el)) {
        el = el[0];
    }
    if (!Array.isArray(path)) {
        path = path.split('/');
    }
    name = path.shift();
    if (!el) {
        return;
    }
    el = el[name];
    if (path.length) {
        return child(el, path);
    }
    return el;
}

function value(el, path) {
    el = child(el, path);
    return el && el.value;
}

function attr(el, path, name) {
    el = child(el, path);
    return el && el.attribs && el.attribs[name];
}

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

    if(node.attribs) {

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
    } else if(node && node.value) {
        value = node.value;
    } else {
        value = '';
    }

    addText(node, value + text);

    return node;
}

exports.child = child;
exports.value = value;
exports.attr = attr;
exports.addChild = addChild;
exports.addText = addText;
exports.concatText = concatText;
