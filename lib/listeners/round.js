// Capture an server iteration and make it recursive if needed
// jshint maxcomplexity: 6
var Bluebird = require('bluebird');

module.exports = function(events) {

  events.hook('round', function(e) {
    var promise = Bluebird.pending();
    var manifest = e.data.instance._manifest;
    var instance = e.data.instance;
    var lastIteration = instance._state.get('lastIteration') ||
      new Date().getTime();

    var iteration = instance._state.get('iteration') || 1;

    Bluebird.all(Object.keys(manifest.target.ranges || {}))
      .map(function(range) {
        var promise = Bluebird.pending();
        var config = manifest.target.ranges[range];
        var name = range;
        var data = {};

        if (iteration === 1)
          data.first = true;


        data.last = instance._state.get('range.last.' + name);
        data.ended = instance._state.get('range.ended.' + name);
        data.config = config.options || config;

        if (!data.ended) {
          events.dispatch('range.' + (config.plugin ?
            'plugin.'  + config.plugin : name), data).then(function(data) {

            if (data.last || !data.data)
              instance._state.set('range.ended.' + name, true);

            instance._state.set('range.last.' + name, data.data);
            promise.resolve({
              name: name,
              data: data.data
            });
          });
        } else {
          promise.resolve();
        }

        return promise.promise;
      }).then(function(ranges) {
        var promise = Bluebird.pending();

        e.data.ranges = ranges.filter(function(item) {
          return item;
        }).reduce(function(curr, next) {
          curr[next.name] = next.data;
          return curr;
        }, {});


        if (iteration > 1 && !Object.keys(e.data.ranges).length)
          return events.dispatch('end');

        if (iteration && (new Date().getTime() - lastIteration) <
          (manifest.target.interval || 0)) {
          setTimeout(function() {
            promise.resolve(true);
          }, lastIteration + manifest.target.interval);
        } else
          promise.resolve(true);

        return promise.promise;
      }).then(function(fetch) {
        if(!fetch)
          return;

        events.dispatch('fetch', e.data).then(function(data) {
          events.dispatch('extract', {
            instance: e.data.instance,
            request: data
          }).then(function(){
            instance._state.set('iteration', ++iteration);
            events.dispatch('round', {instance: e.data.instance});
          });
        });
      }).then(function(){
        promise.resolve();
      }).catch(function(err) {
        promise.reject(err);
      });

    return promise.promise;
  }, 999);
};
