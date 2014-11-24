// Testing for internal intervals
var Crawler = require('../');
var nock = require('nock');
var server = require('./fixtures/mock-server');
require('chai').should();

// Fixtures

describe('Range testing', function() {
  before(function(){
    server();
  });

  after(function(){
    nock.cleanAll();
  });

  it('number ranges should work', function(done) {
    var data = [];

    var job = new Crawler({
      target: {
        url: 'http://crawlerjs-testing.com/page/{{number}}',
        ranges: {
          number: [1, 2, 1] // 1 to 2, step 1
        }
      },
      extractors: [{
        name: 'title',
        fields: {
          title: '//title[1]/text()'
        }
      }]
    });

    job.on('error', function(err){
      throw err;
    });

    job.on('data', function(extracted){
      data.push(extracted);
    });

    job.on('end', function(){
      data.length.should.be.equal(2);
      data[0].data.title.should.be.equal('This is the page 1');
      data[1].data.title.should.be.equal('This is the page 2');
      done();
    });

    job.start();
  });

  it('letter ranges should work', function(done) {
    var data = [];

    var job = new Crawler({
      target: {
        url: 'http://crawlerjs-testing.com/page/{{letter}}',
        ranges: {
          letter: ['a', 'b', 1] // a to b, step 1
        }
      },
      extractors: [{
        name: 'title',
        fields: {
          title: '//title[1]/text()'
        }
      }]
    });

    job.on('error', function(err){
      throw err;
    });

    job.on('data', function(extracted){
      data.push(extracted);
    });

    job.on('end', function(){
      data.length.should.be.equal(2);
      data[0].data.title.should.be.equal('This is the page 1');
      data[1].data.title.should.be.equal('This is the page 2');
      done();
    });

    job.start();
  });

  it('custom ranges should work', function(done) {
    var data = [];

    var job = new Crawler({
      target: {
        url: 'http://crawlerjs-testing.com/page/{{custom.name}}',
        ranges: {
          custom: {
            plugin: 'johndoe'
          }
        }
      },
      extractors: [{
        name: 'title',
        fields: {
          title: '//title[1]/text()'
        }
      }]
    });

    job.on('error', function(err){
      throw err;
    });

    job.on('data', function(extracted){
      data.push(extracted);
    });

    job.on('end', function(){
      data.length.should.be.equal(2);
      data[0].data.title.should.be.equal('This is the page 1');
      data[1].data.title.should.be.equal('This is the page 2');
      done();
    });

    job.plugin({
      name: 'johndoe',
      version: '0.0.1',
      load: function(instance){
        var names = [{name: 'john'}, {name: 'doe'}];

        instance._events.hook('range.plugin.johndoe', function(e){
          var data = e.data;
          var next = names[data.first? 0 : 1];
          var last = names[names.indexOf(next) + 1] === undefined;


          data.data = next;
          data.last = last;
        });
      }
    });

    job.start();
  });

});
