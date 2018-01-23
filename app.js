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
const converter = require('./converter');
const router = express.Router();
// const db = require('/models');

// Global Lat/Lng variables
const Lat = converter.Lat
const Lng = converter.Lng

const earthtimeJson = converter.RawBeats
// console.log(earthtimeJson);

// from express generator
const index = require('./routes/index');
const users = require('./routes/users');

// sets the api default to always be prefixed with /api
app.use('/api', router);

// default api text
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// this contains the API with the Earth Time object
router.get('/earthtime', function(req, res) {
  res.json(earthtimeJson);
});

// render on views
// app.get('/', (req, res) => {
//   res.render('index', {
//     beats: earthtimeJson,
//     user: false
//   })
// })

router.get('/users', function(req, res) {
  res.json(users);
})

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
            // console.log('No user was found... so create a new user with values from Google (all the profile. stuff)');
            if (!user) {
              // console.log('not founds oozer');
                user = new User({
                    google: profile,
                    'location.lat': Lat,
                    'location.lng': Lng
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                // console.log("found user. Return");
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
app.get('/', (req, res) => {
  res.render('index', {
    beats: earthtimeJson,
    user: req.user
  })
})

// update database route
app.put('/user/:id', (req, res) => {
  console.log(req.body);
  res.sendStatus(200)
})

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
