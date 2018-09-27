const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

var firedb = admin.firestore();

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_client', {
    title:'Add Client'
  });
});

// Add Submit POST Route
router.post('/add', ensureAuthenticated, function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const submittedby = req.user.id;

  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();

  // Get Errors
  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
        res.render('add_client', { title:'Add Client', errors:result.array() });
    } else {
    const clientData = {
      name:name,
      email:email,
      submittedby:submittedby
    };

    firedb.collection('clients').doc().set(clientData).then(function(){
      req.flash('success','Client information have been succcessfully saved');
      res.redirect('/');
    }).catch(function(err){
      console.log(err);
      return;
    });
  }
}).catch(function(err){
  console.log(err);
  return;
});
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){

  firedb.collection('clients').doc(req.params.id).get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      //console.log(doc.data());
      var client = doc.data();
      client.id = doc.ref.id;
      res.render('edit_client', {
        title:'Edit Client',
        client:client 
      });
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
});

// Update Submit POST Route
router.post('/edit/:id', ensureAuthenticated, function(req, res){
  let client = {};
  client.name = req.body.name;
  client.email = req.body.email;
  client.submittedby = req.user.id;
  client.id = req.params.id;

  firedb.collection('clients').doc(req.params.id).set(client).then(function(){
    req.flash('success', 'Client information updated');
    res.redirect('/');
  }).catch(function(err){
    console.log(err);
    return;
  });

});

// Delete Client
router.delete('/:id', ensureAuthenticated, function(req, res){

  firedb.collection('clients').doc(req.params.id).delete()
  .then(function(){
    res.send('Success');
  }).catch(function(err){
    console.log(err);
    return;
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
