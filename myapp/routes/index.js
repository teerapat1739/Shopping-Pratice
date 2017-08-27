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


router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_fwmVPdJfpkmwlQRedXec5IxR"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
