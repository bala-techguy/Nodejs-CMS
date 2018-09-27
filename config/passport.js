const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//Initializing Cloud Firestore
const admin = require('firebase-admin');

var firedb = admin.firestore();

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    // Match Username
    firedb.collection('users').doc(username).get()
    .then((snapshot) => {
        if (snapshot.exists)
        {
          bcrypt.compare(password, snapshot.data().password, function(err, isMatch){
            if(err) {
              console.log(err);
            }
            if(isMatch){
              return done(null, snapshot.ref);
            } else {
              return done(null, false, {message: 'Wrong password'});
            }
          });
        }else {
          return done(null, false, {message: 'No user found'});
        }
        
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

  }));

  passport.serializeUser(function(doc, done) {
    done(null, doc.id);
  });

  passport.deserializeUser(function(id, done) {
    //console.log(id);
    firedb.collection('users').doc(id).get()
    .then((snapshot) => {

          done(null,snapshot.ref);
        
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
  });
}
