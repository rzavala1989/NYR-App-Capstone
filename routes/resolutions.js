const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require("../auth/protect-routes");

//bring in Resolution model
require('../models/Resolution');
const Resolution = mongoose.model('resolutions');
require('../models/User');
const User = mongoose.model('users');

router.get('/', ensureAuthenticated, (req, res) => {
    Resolution.find()
      .populate('users')
      .sort({date: 'desc'})
      .then(resolutions => {
        res.render('resolutions/all-resolutions', {
          resolutions:resolutions
        });
      });
});

router.get('/add', ensureAuthenticated, (req, res) =>{
    res.render('resolutions/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) =>{
    Resolution.findOne({
        _id: req.params.id
    })
    .then(resolution => {
        if(resolution.user != req.user.id) {
          req.flash('error_msg', "You can't edit another user's resolution");
          res.redirect("/resolutions")
        } else {
          res.render('resolutions/edit', {
            resolution: resolution
         });
        }
    });
});

//SHow single resolution
router.get('/show/:id', ensureAuthenticated, (req, res) =>{
  Resolution.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('updates.updateUser')
  .then(resolution => {
    res.render('resolutions/show', {
      resolution: resolution
    });
  });
});

//Edit story form
router.get('/edit /:id', ensureAuthenticated, (req, res) =>{
  Resolution.findOne({
    _id: req.params.id
  })
  .then(resolution => {
    res.render('resolutions/edit', {
      resolution: resolution
    });
  });
});
 

router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
  
    if(!req.body.title){
      errors.push({text:'Please add a title'});
    }
    if(!req.body.body){
      errors.push({text:'Please add a short description'});
    }
     
    if(errors.length > 0){
      res.render('resolutions/add', {
        errors: errors,
      });
    } else {
      const newResolution = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        user: req.user.id,
        name: req.user.name
      }
      new Resolution(newResolution)
        .save()
        .then(resolution => {
          req.flash('success_msg', 'Resolution added');
          res.redirect(`/resolutions/show/${resolution.id}`);
        })
    }
  });
  // Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Resolution.findOne({
      _id: req.params.id
    })
    .then(resolution => {
      // new values
      resolution.title = req.body.title;
      resolution.body = req.body.body;
      resolution.status = req.body.status;
  
      resolution.save()
        .then(resolution => {
          req.flash('success_msg', 'Resolution updated');
          res.redirect('/resolutions');
        })
    });
  });

  router.delete('/:id', (req, res) => {
    Resolution.remove({_id: req.params.id})
      .then(() => {
        req.flash('success_msg', 'Resolution has been removed');
        res.redirect('/resolutions');
      });
  });

  //Add updates

  router.post('/update/:id', ensureAuthenticated, (req, res) =>{
    Resolution.findOne({
      _id: req.params.id
    })
    .then(resolution =>{
      console.log(req.body);
      const newUpdate = {
        updateBody: req.body.updateBody,
        updateDate: req.body.updateDate,
        updateUser: req.user.id
      }
      //Add to updates array
      resolution.updates.unshift(newUpdate);
      resolution.save()
        .then(resolution =>{
          res.redirect(`/resolutions/show/${resolution.id}`)
        });
    });
  });
module.exports = router;