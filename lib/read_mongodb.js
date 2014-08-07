var readMongoDb = function(font,url,config){
  db.collection(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['collection']).find({cjsStatus:null}).limit(1).toArray().done(
    function(docs){
      if(docs.length > 0){
        for(doc in docs){
          updateTerm(font,url,config,docs[doc])
        }
      }else{
        console.log(':) Finish');
      }
    }
  )
  updateTerm = function(font,url,config,doc){
    termsCollection.update(
      {_id:doc._id},
      {$set:{cjsStatus:getUuid('xxxxxxxxxxxxxxxx')}},
      {upsert:true,safe:false},
      function(err,data){
        if(err){
          console.log(err)
        }else{
          var url.mongoDbId = doc[font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['id']];
          var key = doc[font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['key']];

          if((typeof font['encode'+font['type']] != 'undefined' && font['encode'+font['type']] == true) || (typeof font['encode'+font['type']] == 'undefined' && font['type'] == 'get')){
            key = encodeURIComponent(key.trim());
          }
          url[font['type']] = font[font['type']].replace(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['parameter'], key);
          var fontTemp = clone(font);
          fontTemp[font['type']+'CurrentEntry']++;
          fontTemp[font['type']] = url[font['type']];
          getEntry(fontTemp,url,config);
        }
      }
    );
  }
}

