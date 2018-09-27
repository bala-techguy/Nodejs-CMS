const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Initializing Cloud Firestore
const admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var firedb = admin.firestore();

const settings = {timestampsInSnapshots: true};
firedb.settings(settings);


// Init App
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', function(req, res){
  if(req.isAuthenticated()){

    firedb.collection('clients').get()
    .then((snapshot) => {
      var clients = [];
      snapshot.forEach(doc => {
        var data = doc.data();
        data.id = doc.ref.id;
        clients.push(data);
      })
      res.render('index', {
        title:'Clients',
        clients: clients
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

  } else {
    res.redirect('/users/login');
  }
  
});

// Route Files
let clients = require('./routes/clients');
let users = require('./routes/users');
app.use('/clients', clients);
app.use('/users', users);

// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
