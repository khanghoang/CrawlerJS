var crawlerJS = require('./index.js');

var cidades = {
  interval: 1000,
  getSample: 'http://tim-localizadorlojas.geoportal3d.com.br/rest/index/cidadebyestado?estado=25',
  get: 'http://tim-localizadorlojas.geoportal3d.com.br/rest/index/cidadebyestado?estado=[numbers:1:27:1]',
  preview: 0,
  extractors: [
    {
      elements: "var cidades = JSON.parse(body); data = cidades.listaObjeto;",
      csv: {name:'cidades.csv',separator:'|',delimiter:'"'}
    }
  ]
}

crawlerJS(cidades,{localProxy: 'http://spobrproxy:3128/'});
