var EventEmitter = require('events').EventEmitter;
var Eventary = require('eventary');
var util = require('util');
var listeners = require('./listeners');

var Crawler = function(manifest) {
  EventEmitter.call(this);

  var self = this;
  this._manifest = manifest;
  this._eventary = new Eventary();

  this._eventary.hook('extracted', function(event) {
    self.emit('data', event.data);
  });

  listeners(this._eventary);
};

util.inherits(Crawler, EventEmitter);

Crawler.prototype.start = function() {
  var self = this;
  var events = self._eventary;

  events.dispatch('fetch', this._manifest).then(function(data) {
    events.dispatch('extract', {
      manifest: self._manifest,
      html: data
    }).then(function() {
      self.emit('end');
    });
  }).catch(function(err){
    self.emit('error', err);
  });
};


module.exports = Crawler;
