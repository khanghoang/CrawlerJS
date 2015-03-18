var range = require('r...e');

module.exports = function(events) {
  events.hook('range.letter', function(e) {
    var data = e.data;
    var config = data.config;
    var current = data.last || config[0];
    var step = data.config[2] || 1;
    var letters = range(current, config[1], step).toArray();
    var next = letters[data.first? 0 : 1];
    var last = letters[letters.indexOf(next) + 1] === undefined;


    data.data = next;
    data.last = last;
  }, 999);
};
