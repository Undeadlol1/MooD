import { Strategy as VKontakteStrategy } from "passport-vkontakte"
import { User, Vk, Profile } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'
const { URL, VK_ID, VK_SECRET,} = process.env

/* VK AUTH */
passport.use(new VKontakteStrategy(
  {
    clientID:     VK_ID,
    clientSecret: VK_SECRET,
    callbackURL:  URL +  "api/auth/vkontakte/callback"
  },
  async function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
    try {
      const existingUser = await User.findOne({
        where: {},
        include: [{
          model: Vk,
          where: {id: profile.id},
        }, Profile],
        raw: true,
        nest: true,
      })

      if (existingUser) return done(null, existingUser)
      else {
        // TODO rework this
        const user = await User.create({})
        const vk = await Vk.create({
          UserId: user.id,
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          image: selectn('photos[0].value', profile),
        })
        const newUser = await User.findById(user.id, {
          include: [Vk, Profile]
        })
        console.log('newUser: ', newUser);
        done(null, newUser)
      }
    } catch (error) {
      console.error(error)
      done(error)
    }
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