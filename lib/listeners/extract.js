var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var options = {
  errorHandler: function() {
    // we will just ignore HTML errors for now
  }
};

module.exports = function(events) {
  events.hook('extract', function(e) {
    var extractors = (e.data.manifest.extractors);
    var doc = new dom(options).parseFromString(e.data.html);

    var result = extractors.map(function(ext) {
      var data = null;

      if (ext.root) {
        data = [];
        xpath.select(ext.root, doc).forEach(function(x) {
          var node = new dom(options).parseFromString(x.toString());
          var fields = {};
          Object.keys(ext.fields).forEach(function(name) {
            var selected = xpath.select(ext.fields[name], node);
            if (!selected.length)
              return;

            fields[name] = selected[0].value ? selected[0].value :
              selected[0].toString();
          });

          data.push(fields);
        });
      } else {
        var fields = {};
        Object.keys(ext.fields).forEach(function(name) {
          var selected = xpath.select(ext.fields[name], doc);
          if (!selected.length)
            return;

          fields[name] = selected[0].value ? selected[0].value :
            selected[0].toString();
        });

        data = fields;
      }

      ext.data = data;

      if(data)
        events.dispatch('extracted', ext);

      return ext;
    });

    e.data = result;
  }, 999);
};
