const express = require('express');
const hbs  = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const exphbs  = require('express-handlebars');


const app = express();

//Loading user and resolutions routes
const users = require('./routes/users');


//DB Config
const db = require('./config/database');

mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Index Route
app.get('/', (req, res) => {
  const title = ' Welcome to the New Year...';
  res.render('index', {
    title: title
  });
});

// About Route
// app.get('/about', (req, res) => {
//   res.render('about');
// });

//
//Use routes
app.use('/users', users);

const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});