var Crawler = require('../');
var chai = require('chai');
var nock = require('nock');
var server = require('./fixtures/mock-server');
chai.should();

describe('CrawlerJS general testing', function() {
  before(function() {
    server();
  });

  after(function() {
    nock.cleanAll();
  });

  it('should be a function', function() {
    (typeof Crawler).should.be.equal('function');
  });

  it('shold capture data', function(done) {
    var data = [];

    var job = new Crawler({
      target: {
        url: 'http://crawlerjs-testing.com/',
        agent: {
          headers: {
            'User-Agent': 'CrawlerJS'
          }
        }
      },
      extractors: [{
        name: 'users',
        root: '//tbody/tr',
        fields: {
          name: '//td[2]/text()',
          surname: '//td[3]/text()'
        }
      }, {
        name: 'metadata',
        fields: {
          title: '//title[1]/text()'
        }
      }]
    });

    job.on('error', function(err) {
      throw err;
    });

    job.on('data', function(extracted) {
      data.push(extracted);
    });

    job.on('end', function() {
      data[0].data.length.should.be.equal(3);
      data[0].data[0].name.should.be.equal('Mark');
      data[1].data.title.should.be.equal('Testing document for CrawlerJS');
      done();
    });

    job.start();
  });

  it('shold be able to plug pluggins', function(done) {
    var job = new Crawler({
      target: {
        url: 'http://crawlerjs-testing.com/plugin',
        agent: {
          headers: {
            'User-Agent': 'CrawlerJS'
          }
        }
      },
      extractors: [{
        name: 'metadata',
        fields: {
          title: '//title[1]/text()'
        }
      }]
    });

    job.plugin({
      name: 'testing',
      version: '0.1.1',
      load: function(instance, options){
        instance._events.hook('start', function(){
          options.testing.should.be.equal(true);
          done();
        });
      }
    }, {
      testing: true
    });

    job.start();
  });

});
