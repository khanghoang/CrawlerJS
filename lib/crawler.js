var EventEmitter = require('events').EventEmitter;
var Eventary = require('eventary');
var util = require('util');
var Cache = require('./cache');
var listeners = require('./listeners');
var Joi = require('joi');

/**
 * The main class
 * @class Crawler
 * @constructor
 * @param {Object} manifest The object configuration
 * @returns {Undefined}
 */
var Crawler = function(manifest) {

  if (!(this instanceof Crawler))
    return new Crawler(manifest);

  EventEmitter.call(this);

  var self = this;

  /**
   * Holds the internal configuration aka manifest
   * @type {Object}
   * @private
   */
  this._manifest = manifest;

  /**
   * The main event manager, here is where all magic happens
   * @type {Object}
   * @private
   */
  this._events = new Eventary();

  /**
   * Internal state management
   * @type {Object}
   * @private
   */
  this._state = new Cache();

  /**
   * Internal plugin keeper
   * @type {Object}
   * @private
   */
  this._plugins = {};

  this._events.hook('extracted', function(event) {
    self.emit('data', event.data);
  });

  listeners(this._events);

  // Automatically starts if 'start' is true
  // in the manifest
  if (this._manifest.start)
    process.nextTick(function() {
      self.start();
    });
};
util.inherits(Crawler, EventEmitter);

/**
 * Starts the crawling process
 * @return {Undefined}
 */
Crawler.prototype.start = function() {
  var self = this;
  var events = self._events;

  events.dispatch('start', {
    instance: self
  }).then(function() {

    return events.dispatch('round', {
      instance: self
    });

  }).catch(function(err) {
    self.emit('error', err);
  });

  events.hook('end', function() {
    self.emit('end');
  }, 999);
};

/**
 * Attach a plugin to the main class
 * @param  {Object} plugin  An object containing the plugin configuration
 * @param  {Object} options An optional object to be passed to the plugin
 * @return {Undefined}
 */
Crawler.prototype.plugin = function(plugin, options) {

  try {
    // The name should be a string
    Joi.assert(plugin.name, Joi.string());

    // The version should be a string
    Joi.assert(plugin.version, Joi.string());

    // Load should be a function
    Joi.assert(plugin.load, Joi.func());
  } catch (err) {
    this.emit('error', err);
  }

  // Load the plugin and add it to the array
  plugin.load(this, options);
  this._plugins[plugin.name] = plugin;
};


module.exports = Crawler;
