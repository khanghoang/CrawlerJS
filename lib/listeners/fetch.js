var request = require('request');
var Bluebird = require('bluebird');

module.exports = function(events) {
  events.hook('fetch', function(e) {
    var promise = Bluebird.pending();

    request(e.data.target, function(err, header, data) {
      e.data = data;
      promise.resolve();
    });

    return promise.promise;
  }, 999);
};
