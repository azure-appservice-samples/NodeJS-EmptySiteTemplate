module.exports = function(app)
{   var Eligible = require('eligible-node');


    //or, pass them as object:
    var eligible = Eligible({
        apiKey: 'SbdQJVVtHq_cphPqloPIMgfqGMt8XewHM-Ka',
        isTest: true
    });
  /*   app.post('/homepage',urlencodedParser,function(req,res){
        var username = req.body.uname;
        console.log(username)
        res.render('homepage',{uname:username})
     });*/
     app.get('/mytabledata',function(req,res){
       eligible.Payer.all({
         endpoint: 'coverage',
      }).then(function(payers) {
        console.log(payers);
        res.send(payers)
      })

     })
/*     app.get('/about',function(req,res){
        res.render('about.html');
    });
*/
}
