const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const favicon = require('serve-favicon');
const ENV = require('./app-env');
const findOrCreate = require('mongoose-findorcreate');

// from express generator
const index = require('./routes/index');
const users = require('./routes/users');

// Mongoose Setup
mongoose.connect('mongodb://localhost:27017/earth-time');

// Middleware
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Setting up the Passport Strategies
const googleClientKey = ENV.GOOGLE_CLIENT_ID;
const googleClientSecret = ENV.GOOGLE_CLIENT_SECRET;
const googleMapsKey = ENV.GOOGLE_MAPS_KEY;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// app.use('/', index);
// app.use('/routes', users);

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

passport.use(new GoogleStrategy({
    clientID: googleClientKey,
    clientSecret: googleClientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
        //check user table for anyone with a google ID of profile.id
        User.findOne({
          // console.log("found a user");
            'google.id': profile.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Google (all the profile. stuff)
            if (!user) {
              console.log('not founds oozer');
                user = new User({
                    google: profile,
                    'location.lat': 30.2672,
                    'location.lng': 97.7431
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    }
));

// Finish setting up the Sessions
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// -> Google
app.get('/auth/google', passport.authenticate('google', { scope: "email" }));

// <- Google
app.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/' }));

// Logout
app.get('/logout', function(req, res){
  req.logout();
  res.redirect("/")
})

// Home page
app.get('/', function(req, res){
  console.log(req.user);
  res.render('index', {user: req.user});
  // res.send('hello world')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log("server running on port 3000");

module.exports = app;
