var crawlerjs = require('../index.js');

var crawler = {
  interval: 100,
  getSample: 'http://migranteweb.mte.gov.br/migranteweb/publico/consultarProcessoInternet/consultarProcesso.seam',
  get: 'http://migranteweb.mte.gov.br/migranteweb/publico/consultarProcessoInternet/consultarProcesso.seam',
  postSample:'AJAXREQUEST=subviewCorpoPagina:regionTemplate&subviewCorpoPagina:pesquisarProcessoForm=subviewCorpoPagina:pesquisarProcessoForm&subviewCorpoPagina:pesquisarProcessoForm:j_id49=NOME_ESTRANGEIRO&subviewCorpoPagina:pesquisarProcessoForm:j_id59=Renata&javax.faces.ViewState=j_id1&subviewCorpoPagina:pesquisarProcessoForm:j_id64=subviewCorpoPagina:pesquisarProcessoForm:j_id64',
  post:'',
  encodeget: false,
  preview: 0,
  encoding: 'binary',
  extractors: [
    {
      selector: '*table',
      callback: function(err, html){
        if(!err){
          data = {};
          data.nome = html.text();
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

crawlerjs(crawler);
