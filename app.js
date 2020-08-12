const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const PORT = process.env.PORT || 9000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((data) => {
    console.log('MongoDbConnect');
  })
  .catch((err) => {
    console.log(err);
  });

//Encode Body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

//Connect flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

//set view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.listen(PORT, () => {
  console.log(`Your App is running at ${PORT}`);
});
