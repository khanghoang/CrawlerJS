// Get all listeners inside this folder
var fs = require('fs');
var files = fs.readdirSync(__dirname).map(function(name){
  if(name !== 'index.js')
    return require(__dirname + '/' + name);
}).filter(function(func){
  if(typeof func === 'function')
    return true;

  return false;
});

module.exports = function(events){
  files.forEach(function(listener){
    listener(events);
  });
};
