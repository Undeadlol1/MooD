import express from "express"
import passport from "passport"
import { Strategy as TwitterStrategy } from "passport-twitter"
import { Strategy as VKontakteStrategy } from "passport-vkontakte"

const router = express.Router();

/* VK AUTH */
passport.use(new VKontakteStrategy(
  {
    clientID:     '5202075', // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: 'QjVr1JLVAXfVmZDJ6ws9',
    // callbackURL:  "http://localhost:3000/auth/vkontakte/callback"
    callbackURL:  "http://127.0.0.1:3000/auth/vkontakte/callback"
  },
  function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
    // console.log(accessToken, refreshToken, params, profile);

    // Now that we have user's `profile` as seen by VK, we can
    // use it to find corresponding database records on our side.
    // Also we have user's `params` that contains email address (if set in 
    // scope), token lifetime, etc.
    // Here, we have a hypothetical `User` class which does what it says.
      done(null, profile);
    // User.findOrCreate({ vkontakteId: profile.id })
    //     .then(function (user) { done(null, user); })
    //     .catch(done);
  }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
    done(null, user); // redneck bullshit
    // done(null, user.id); // proper version
});

passport.deserializeUser(function(id, done) {
    done(null, id) // this was added, this is not right
    // User.findById(id)
    //     .then(function (user) { done(null, user); })
    //     .catch(done);
});

/* TWITTER AUTH */
passport.use(new TwitterStrategy({
    consumerKey: "L9moQHoGeNq7Gz25RRmuBNeg3",
    consumerSecret: "D15EvlV55IfCsGnsydRi5I9QAISzkYykKOO0rCqnowDfiUmwGZ",
    callbackURL: "http://localhost:3000/login/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
      // console.log('login callback is called!');
      // console.log(profile);
      done(null, profile);
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));

// routes
router
  .get('/twitter', passport.authenticate('twitter'))
  .get('/twitter/callback',
     passport.authenticate('twitter', { successRedirect: '/',
                                        failureRedirect: '/failed-login' }))
  .get('/vkontakte', passport.authenticate('vkontakte'))
  .get('/vkontakte/callback',
    passport.authenticate('vkontakte', { successRedirect: '/',
                                          failureRedirect: '/failed-login' }))
  .get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

export {router, passport}