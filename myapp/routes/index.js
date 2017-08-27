var express = require('express');
var router = express.Router();
var Product =require('../models/product');
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');


var csrfProtection = csrf();
router.use(csrfProtection);

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
//โดยจะเก็บค่าต่างๆไว้ใน session เช่น จำนวนสินค้า ราคา จะเก็บจนกว่าจะสิ้นสุดsession หรือ ถูกทำลาย

router.get('/add-to-cart/:id',function(req, res,next ){
      var productId = req.params.id;
      var cart = new Cart(req.session.cart ? req.session.cart : {});

      Product.findById(productId,function(err, product){
        if(err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
      });
});

router.get('/shopping-cart',function(req,res,next){
      if(!req.session.cart){
        return res.render('shop/shopping-cart',{products:null});
      }
      var cart = new Cart(req.session.cart);
      res.render('shop/shopping-cart',{products: cart.generateArray(),totalPrice: cart.totalPrice});
});

module.exports = router;
