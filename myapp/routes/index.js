var express = require('express');
var router = express.Router();
var Product =require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs){
    //var productChunks=[];
  //  var chunkSize=3;
  //  for(var i; i<docs.length; i+=chunkSize){
    //  productChunks.push(docs.slice(i, i+chunkSize));
  // }
      res.render('shop/index', { title: 'Shopping cart', products: docs });// successMsg ถูกนำไป render ที่ index.hbs

  });
});
router.get('/user/signup',function(req, res, next){
  res.render('user/signup',{csrfToken: req.csrfToken()});
});
router.post('/user/signup',function(req,res,next){
  res.redirect('/');
});
module.exports = router;
