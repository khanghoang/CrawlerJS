var crawlerJS = require('./index.js');

var crawler = {
  interval: 1000,
  cookieSample: 'https://portaldocidadao.saude.gov.br/portalcidadao/validaNumeroCNS.htm',
  cookie: 'https://portaldocidadao.saude.gov.br/portalcidadao/validaNumeroCNS.htm',
  cookieCode: '',
  getSample: 'https://portaldocidadao.saude.gov.br/portalcidadao/validaNumeroCNS.htm',
  get: 'https://portaldocidadao.saude.gov.br/portalcidadao/validaNumeroCNS.htm',
  encodeget: false,
  preview: 2,
  extractors: [
    {
      selector: 'a',
      elements: "data.codigo = $(this).attr('href'); data.empresa = $(this).text();",
      csv: {name:'empresas.csv',separator:'|',delimiter:'"'}
    }
  ]
}

var config = {
  localProxy: 'http://spobrproxy:3128/'
}

crawlerJS(crawler,config);

/*
var request = require('request');
request('http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
  }
})
*/