var express = require("express");
//var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/eligible",function(req,res){
  res.sendFile(path + "eligible.html");
});

router.get("/eligiblecoverage",function(req,res){
  res.sendFile(path + "eligiblecoverage.html");
});

//include main.js
require('./model/main')(app);

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

var port = process.env.PORT || 3000;

app.listen(port,function(){
  console.log("Live at Port " + port);
});
