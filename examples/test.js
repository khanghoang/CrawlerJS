var crawlerjs = require('../index.js');

var crawler = {
  interval: 1000,
  cookieSample: 'https://portaldocidadao.saude.gov.br/portalcidadao/validaNumeroCNS.htm',
  cookie: 'https://portaldocidadao.saude.gov.br/portalcidadao/validaNumeroCNS.htm',
  getSample: 'https://portaldocidadao.saude.gov.br/portalcidadao/validaNumeroCNS.htm',
  get: 'https://portaldocidadao.saude.gov.br/portalcidadao/validaNumeroCNS.htm',
  encodeget: false,
  preview: 0,
  extractors: [
    {
      selector: 'a',
      callback: function(err, html, url, response){
        console.log('Crawled url:');
        console.log(url);
        // console.log(response); // If you need see more details about request
        if(!err){
          data = {};
          data.codigo = html.attr('href');
          data.empresa = html.text();
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

var config = {
//  localProxy: 'http://proxy:3223/'
}

crawlerjs(crawler,config);
