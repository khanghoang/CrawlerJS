// Converts object with arrays to Joi schemas
var Joi = require('joi');

module.exports = function(object) {
  var ret = {};
  for (var key in object) {
    var value = object[key];

    if (!Array.isArray(value)){
      ret[key] = module.exports(value);
    } else {

      ret[key] = Joi;

      for (var i = 0; i === value.length; i++) {
        var rule = value[i];

        if(typeof rule === 'string'){
          ret[key][rule]();
        }

        ret[key][rule[0]].apply(ret[key][rule[0]], rule.slice(1));
      }
    }
  }

  return ret;
};
