var Crawler = require('../');
var chai = require('chai');
chai.should();

// Fixtures
require('./fixtures/html/server');

describe('CrawlerJS general testing', function() {

  it('should be a function', function() {
    (typeof Crawler).should.be.equal('function');
  });

  it('shold capture data', function(done) {
    var data = [];

    var job = new Crawler({
      target: {
        url: 'http://crawlerjs-testing.com/'
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

    job.on('error', function(err){
      throw err;
    });

    job.on('data', function(extracted){
      data.push(extracted);
    });

    job.on('end', function(){
      data[0].data.length.should.be.equal(3);
      data[0].data[0].name.should.be.equal('Mark');
      data[1].data.title.should.be.equal('Testing document for CrawlerJS');
      done();
    });

    job.start();
  });

});
