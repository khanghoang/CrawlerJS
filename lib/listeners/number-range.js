module.exports = function(events) {
  events.hook('range.number', function(e) {
    var data = e.data;
    var config = data.config;
    var current = data.last || config[0];
    var step = data.config[2] || 1;
    var next = data.first? current : current + step;
    var last = (next + step) > config[1] ? true : false;


    data.data = next;
    data.last = last;
  }, 999);
};
