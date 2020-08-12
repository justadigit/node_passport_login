const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
router.get('/login', (req, res) => {
  res.render('login', { errors: '' });
});
router.get('/register', (req, res) => {
  res.render('register', { errors: '' });
});
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //Check Required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill all fields' });
  }

  //Check password match
  if (password !== password2) {
    errors.push({ msg: 'Password Not Match!' });
  }

  //Check Password length
  if (password.length < 6) {
    errors.push({ msg: 'Passwords should be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        res.status(500).json(err);
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: hash,
        });
        newUser
          .save()
          .then((data) => {
            req.flash(
              'success_msg',
              'You are successfully registered!You can now login!'
            );
            res.redirect('/users/login');
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
