var nock = require('nock');

nock('http://crawlerjs-testing.com')
  .get('/')
  .replyWithFile(200, __dirname + '/users.html');

nock.disableNetConnect();
