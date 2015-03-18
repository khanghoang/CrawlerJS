var nock = require('nock');


var server = function() {

  // Normal scrap
  nock('http://crawlerjs-testing.com')
    .get('/')
    .matchHeader('User-Agent', 'CrawlerJS')
    .replyWithFile(200, __dirname + '/html/users.html');

  // Plugin
  nock('http://crawlerjs-testing.com')
    .get('/plugin')
    .reply(200, '<works>yes</works>');

  // URL ranges
  nock('http://crawlerjs-testing.com')
    .get('/page/1')
    .replyWithFile(200, __dirname + '/html/page1.html')
    .get('/page/2')
    .replyWithFile(200, __dirname + '/html/page2.html')
    .get('/page/a')
    .replyWithFile(200, __dirname + '/html/page1.html')
    .get('/page/b')
    .replyWithFile(200, __dirname + '/html/page2.html')
    .get('/page/john')
    .replyWithFile(200, __dirname + '/html/page1.html')
    .get('/page/doe')
    .replyWithFile(200, __dirname + '/html/page2.html');

};

module.exports = server;
