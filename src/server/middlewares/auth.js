import { Strategy as VKontakteStrategy } from "passport-vkontakte"
import { Strategy as TwitterStrategy } from "passport-twitter"
import { User } from '../data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'

/**
 * abstract user creation with different social media
 * 
 * @param {String} provider service name
 * @param {String} userId service's user id
 * @param {String} display_name user's public name
 * @param {String} image user's image url
 * @returns {Promise}
 */
function findOrCreateUser(provider, userId, display_name, image) { // TODO add username
  return  User.findOrCreate({
            raw: true,    
            where: {[provider]: userId}, 
            defaults: {image, display_name} // TODO make image migration
          })
            // TODO add callbacks
}

/* VK AUTH */
passport.use(new VKontakteStrategy(
  {
    clientID:     '5202075',
    clientSecret: 'QjVr1JLVAXfVmZDJ6ws9',
    callbackURL:  "http://127.0.0.1:3000/auth/vkontakte/callback"
  },
  function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) { 
    // NOTE: params contain addition requested info    
      User.findOrCreate({
        where: {vk_id: profile.id}, 
        defaults: {
          username: profile.username, // TODO this
          display_name: profile.displayName,
          // email: params.email,
          image: selectn('photos[0].value', profile), // TODO make image migration
        }, 
        // raw: true
      })
      .then(function (result) {
        const user = result[0]
        done(null, user); 
      })
      // .spread(user => done(null, user.get({plain: true})))
      .catch(done);
  }
));

/* TWITTER AUTH */
passport.use(new TwitterStrategy({
    consumerKey: "L9moQHoGeNq7Gz25RRmuBNeg3",
    consumerSecret: "D15EvlV55IfCsGnsydRi5I9QAISzkYykKOO0rCqnowDfiUmwGZ",
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      where: {twitter_id: profile.id}, 
      defaults: {
        username: profile.username,
        display_name: profile.username,
        image: selectn('photos[0].value', profile), // TODO make image migration
      }, 
      raw: true
    })
    .then(function (result) {
      done(null, result[0]); 
    })
    .catch(done);
  }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User
    .findById(id)
    .then((user) => {
      done(null, (selectn('dataValues', user)))
    })
    .catch(done);
});

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .get('/twitter', passport.authenticate('twitter'))
  .get('/twitter/callback',
     passport.authenticate('twitter', { successRedirect: '/',
                                        failureRedirect: '/failed-login' })) // TODO implement failure login route
                                        // TODO maybe add { failureFlash: true } ?
  .get('/vkontakte', passport.authenticate('vkontakte')) // , {scope: ['email']}
  .get('/vkontakte/callback',
    passport.authenticate('vkontakte', { successRedirect: '/',
                                          failureRedirect: '/failed-login' }))
  .get('/logout', function(req, res){
    req.logout();
    res.end();
  })

export {passport}
export default router