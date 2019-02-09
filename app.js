const express = require('express');
const hbs  = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');

const {mongoURI} = require('./config/database');


const app = express();
app.use(express.json());


//Loading user and resolutions routes
const users = require('./routes/users');
const resolutions = require('./routes/resolutions');


//DB Config
const db = require('./config/database');
//Passport Config
require('./config/passport')(passport);

mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//Load Resolutions Model
require("./models/Resolution");
const Resolution = mongoose.model('resolutions');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

// Handlebars Helpers
const {
  truncate, 
  stripTags,
  formatDate,
  select,
  editLink
} = require('./helpers/hbs');


// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editLink: editLink
  },
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

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

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
app.use('/resolutions', resolutions);

// const port = 8080;

// app.listen(port, () =>{
//   console.log(`Server started on port ${port}`);
// });



if (require.main === module) {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(mongoURI, { useMongoClient: true });

  app.listen(process.env.PORT || 3000, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = {app};
