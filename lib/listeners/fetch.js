var request = require('request');
var Bluebird = require('bluebird');

module.exports = function(events) {

  events.hook('fetch', function(e) {
    var promise = Bluebird.pending();
    var config = e.data.target.agent || {};
    config.url = e.data.target.url;

    request(config, function(err, res, data) {
      if(err)
        return promise.reject(err);

      e.data = data;
      e.headers = res.herader;
      e.statusCode = res.status;
      promise.resolve();

    });

    return promise.promise;
  }, 999);
};
