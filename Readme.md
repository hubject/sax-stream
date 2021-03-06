[![Build Status](https://img.shields.io/travis/code42day/sax-stream.svg)](http://travis-ci.org/code42day/sax-stream)
[![Dependency Status](https://img.shields.io/gemnasium/code42day/sax-stream.svg)](https://gemnasium.com/code42day/sax-stream)
[![NPM version](https://img.shields.io/npm/v/sax-stream.svg)](https://www.npmjs.org/package/sax-stream)

# sax-stream

[Transform stream][transform-stream] for parsing large XML files. It is using SAX module internally. Emits objects:
one object per each selected node.

## Installation

	  $ npm install sax-stream


## Usage

Use as any transform stream: pipe request or file stream to it, pipe it downstream to another
transform/writeable stream or handle `data` event.

```javascript
var saxStream = require('sax-stream');

request('http://blog.npmjs.org/rss')
  .pipe(saxStream({
  	strict: true,
    tag: 'item' // or tags: ['item']
  }))
  .on('data', function(item) {
    console.log(item);
  });
```

### Multiple tags
```javascript
const {saxStream, tags} = require('sax-stream');

request('http://blog.npmjs.org/rss')
  .pipe(saxStream({
  	strict: true,
    tags: ['itemA', 'itemB']
  }))
  .on('data', ({itemA, itemB}) => {
    itemA && console.log('Item A', data);
    itemB && console.log('Item B', data);
  })
  ;

// or with a helper:

request('http://blog.npmjs.org/rss')
  .pipe(saxStream({
  	strict: true,
    tags: ['itemA', 'itemB']
  }))
  .on('data', tags({
    itemA: data => console.log('Item A', data),
    itemB: data => console.log('Item B', data),
  }))
  ;
```

## API

Create passing options object:

- `omitNsPrefix` - if set to `true`, removes namespace prefix of elements
- `tag` - name of the tag to select objects from XML file (this or `tags` is required)
- `tags` - name of tags to select objects from XML file (this or `tag` is required)
- `highWaterMark` - size of internal transform stream buffer - defaults to 350 objects
- `strict` - default to false, if `true` makes sax parser to accept valid XML only
- `normalize`, `lowercase`, `xmlns`, `position`, `strictEntities`, `noscript` - passed to [sax] parser

# License

MIT

[transform-stream]: http://nodejs.org/api/stream.html#stream_class_stream_transform
[sax]: https://github.com/isaacs/sax-js#arguments
