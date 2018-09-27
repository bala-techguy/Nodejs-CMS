const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Initializing Cloud Firestore
const admin = require('firebase-admin');

var firedb = admin.firestore();

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  req.getValidationResult().then(function (result) {
  if(!result.isEmpty()){
    res.render('register', {
      errors:results.array()
    });
  } else {
    let newUser = {};
    newUser.name = name;
    newUser.email = email;
    newUser.username = username;
    newUser.password = password;

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        const userData = {
          name:newUser.name,
          email:newUser.email,
          username:newUser.username,
          password:newUser.password
        };
        firedb.collection('users').doc(username).set(userData).then(function(){
          req.flash('success','You are now registered and can log in');
          res.redirect('/users/login');
        }).catch(function(err){
          console.log(err);
          return;
        });
      });
    });
  }
}).catch(function(err){
  console.log(err);
  return;
});
});

// Login Form
router.get('/login', function(req, res){
  res.render('login', {username:'admin', password: '123'});

});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
