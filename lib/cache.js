// Application state management
var State = function(){
  this._state = {};
};

State.prototype.get = function(key){
  return this._state[key];
};

State.prototype.set = function(key, val){
  return this._state[key] = val;
};

State.prototype.del = function(key){
  delete this._state[key];
};

module.exports = State;

