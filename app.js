const express = require('express');
const hbs  = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/vidjot-dev', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});