var fs = require('fs');

var xmlnode = require('..');
var memory = require('./memory');

/*global describe, it */


describe('xmlnode', function(){
  it('should parse a single empty node', function(done){
    var result = [];

    fs.createReadStream(__dirname + '/one.xml')
      .pipe(xmlnode({
        tag: 'ITEM'
      }))
      .pipe(memory(result))
      .on('finish', function(err) {
        result.should.have.length(1);
        result[0].should.eql({});
        done(err);
      });
  });

  it('should parse nodes with text', function(done){
    var result = [];

    fs.createReadStream(__dirname + '/two.xml')
      .pipe(xmlnode({
        tag: 'ITEM'
      }))
      .pipe(memory(result))
      .on('finish', function(err) {
        result.should.have.length(2);
        result[0].A.should.equal('abc');
        result[0].B.should.equal('15');
        result[1].A.should.equal('def');
        result[1].B.should.equal('16');
        done(err);
      });
  });

  it('should parse nodes with text in strict mode', function(done){
    var result = [];

    fs.createReadStream(__dirname + '/two.xml')
      .pipe(xmlnode({
        strict: true,
        tag: 'item'
      }))
      .pipe(memory(result))
      .on('finish', function(err) {
        result.should.have.length(2);
        result[0].a.should.equal('abc');
        result[0].b.should.equal('15');
        result[1].a.should.equal('def');
        result[1].b.should.equal('16');
        done(err);
      });
  });

  it('should parse nodes and attributes in lowercase mode', function(done){
    var result = [];

    fs.createReadStream(__dirname + '/three.xml')
      .pipe(xmlnode({
        lowercase: true,
        tag: 'item'
      }))
      .pipe(memory(result))
      .on('finish', function(err) {
        var item, a, b;

        result.should.have.length(1);

        item = result[0];

        a = item.a;
        b = item.b;

        a.should.have.length(3);
        b.should.be.type('object');

        a[0].attribs.attr.should.eql('1');

        done(err);
      });
  });

  it('should parse nodes with attributes when configured', function(done){
    var result = [];

    fs.createReadStream(__dirname + '/three.xml')
      .pipe(xmlnode({
        tag: 'ITEM'
      }))
      .pipe(memory(result))
      .on('finish', function(err) {

        var item, a, b;

        result.should.have.length(1);
        item = result[0];
        item.should.not.have.property('attribs');

        a = item.A;
        b = item.B;

        a.should.have.length(3);
        b.should.be.type('object');

        a[0].should.have.property('value', 'abc');
        a[0].should.have.property('attribs');
        a[0].attribs.ATTR.should.eql('1');

        a[1].should.have.property('value', 'def');
        a[1].should.have.property('attribs');
        a[1].attribs.ATTR.should.eql('2');

        a[2].should.have.property('value', 'ghi');
        a[2].should.have.property('attribs');
        a[2].attribs.ATTR.should.eql('3');

        b.should.have.property('value', '15');
        b.should.have.property('attribs');
        b.attribs.ATTR.should.eql('4');

        done(err);
      });
  });

  it('should parse nodes with cdata', function(done){
    var result = [];

    fs.createReadStream(__dirname + '/four.xml')
      .pipe(xmlnode({
        tag: 'ITEM'
      }))
      .pipe(memory(result))
      .on('finish', function(err) {
        result.should.have.length(2);
        result[0].A.should.equal('abc');
        result[0].B.should.equal('15');
        result[1].A.should.equal('def');
        result[1].B.should.equal('16');
        done(err);
      });
  });

  it('should parse script elements', function(done) {
    var result = [];

    fs.createReadStream(__dirname + '/page.html')
      .pipe(xmlnode({
        tag: 'SCRIPT',
        trim: true,
        strict: false,
        noscript: true
      }))
      .pipe(memory(result))
      .on('finish', function(err) {
        result.should.have.length(2);
        result[0].should.have.property('value', 'var z = 5;');
        result[1].should.have.property('value', 'z += 3;');
        done(err);
      });

  });

});
