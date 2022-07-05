var express = require('express');
var router = express.Router();
const passport =require("passport");
const passportLocal = require("passport-local")
const userModel = require("./users")
const cartModel = require("./cart");
const cart = require('./cart');

passport.use(new passportLocal(userModel.authenticate()));


router.get('/',function(req,res){
  res.render("index")
})

router.get("/profile",isLoggedIn,function(req,res){
    userModel.findOne({username:req.session.passport.user})

    .then(function(data){
      cartModel.find()
      .then((cart)=>{

        res.render('profile',{cart,data})
      })
    })
  })
router.get("/prof",isLoggedIn,function(req,res){
  res.redirect('/profile')
})

router.post("/register",function(req,res){
    var newUser = new userModel({
      username:req.body.username,
      name:req.body.name
    });
    userModel.register(newUser,req.body.password)
    .then(function(){
      passport.authenticate("local")(req,res,function(){
        res.redirect("/profile")
      });
    });
  });
  
  
  router.post("/login",passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/"
  }),function(req,res){
   
  });
  
  
  router.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/")
  });
  
  
  
  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      res.redirect('/');
    }
  }

  router.post("/makeproduct",isLoggedIn,function(req,res){
    userModel.findOne({
        username:req.session.passport.user
    }).then(function(foundeduser){
        cartModel.create({
          productname:req.body.productname,
          productimage:req.body.productimage,
            productprice:req.body.productprice
        }).then(function(createdcart){
                res.redirect("/profile")
            })
            
        })
    })
  

  router.post("/cart/:id",isLoggedIn,function(req,res){
    userModel.findOne({
      username:req.session.passport.user
    }).then(function(foundeduser){
      foundeduser.cart.push(req.params.id)
         foundeduser.save()
         .then(function(saved){
           res.redirect("/profile")
      })
    })
  })

  router.get("/cart/:id",isLoggedIn,function(req,res){
      userModel.findOne({
        username:req.session.passport.user
      })
       .populate("cart")
      .then(function(cart){
        cartModel.findOne({
          _id:req.params.id
        }).then(function(foundedcart){
            res.render("cart",{cart})
        })
        
      })
  })

  router.post("/deletecart/:id",isLoggedIn,function(req,res){
    userModel.findOne({
      username:req.session.passport.user
    }).then(function(foundeduser){
        cartModel.findOne({
          _id:req.params.id
        }).then(function(foundedcart){
          if(foundeduser.cart.indexOf(req.params.id)=== -1){

          }
          else{
          foundeduser.cart.splice(req.params.id)
          }
          foundeduser.save()
          .then(function(saved){
            res.redirect("/profile")
       })
        })
    })
  })
  router.get('/qqq',function(req,res){
    cartModel.find().then(function(c){
      res.send(c)
    })
  })
  router.get('/aaa',isLoggedIn,function(req,res){
    userModel.find().then(function(user){
      res.send(user)
    })
  })

module.exports = router;
