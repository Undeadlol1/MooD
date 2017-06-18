import { Strategy as TwitterStrategy } from "passport-twitter"
import { User, Profile } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'

const { URL, TWITTTER_ID, TWITTER_SECRET } = process.env

/* TWITTER AUTH */
passport.use(new TwitterStrategy({
    consumerKey: TWITTTER_ID || "L9moQHoGeNq7Gz25RRmuBNeg3",
    consumerSecret: TWITTER_SECRET || "D15EvlV55IfCsGnsydRi5I9QAISzkYykKOO0rCqnowDfiUmwGZ",
    callbackURL: (URL || "http://127.0.0.1:3000/") +  "api/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      where: {twitter_id: profile.id},
      defaults: {
        username: profile.username,
        display_name: profile.username,
        image: selectn('photos[0].value', profile), // TODO make image migration
      },
      include: [Profile],
      raw: true
    })
    .then(function (result) {
      done(null, result[0]);
    })
    .catch(done);
  }
));

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .get('/twitter', passport.authenticate('twitter'))
  .get('/twitter/callback',
     passport.authenticate('twitter', { successRedirect: '/',
                                        failureRedirect: '/failed-login' })) // TODO implement failure login route
export default router