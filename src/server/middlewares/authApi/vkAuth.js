import { Strategy as VKontakteStrategy } from "passport-vkontakte"
import { User, Profile } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'
const { URL, VK_ID, VK_SECRET,} = process.env

/* VK AUTH */
passport.use(new VKontakteStrategy(
  {
    clientID:     VK_ID || '5202075',
    clientSecret: VK_SECRET || 'QjVr1JLVAXfVmZDJ6ws9',
    callbackURL:  (URL || "http://127.0.0.1:3000/") +  "api/auth/vkontakte/callback"
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
        include: [Profile]
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

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .get('/vkontakte', passport.authenticate('vkontakte')) // , {scope: ['email']}
  .get('/vkontakte/callback',
    passport.authenticate('vkontakte', { successRedirect: '/',
                                          failureRedirect: '/failed-login' }))

export default router