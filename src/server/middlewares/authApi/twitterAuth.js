import { Strategy as TwitterStrategy } from "passport-twitter"
import { User, Twitter, Profile } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'

const { URL, TWITTTER_ID, TWITTER_SECRET } = process.env

/* TWITTER AUTH */
passport.use(new TwitterStrategy({
    consumerKey: TWITTTER_ID,
    consumerSecret: TWITTER_SECRET,
    callbackURL: URL +  "api/auth/twitter/callback"
  },
  async function(token, tokenSecret, profile, done) {
    try {
      const existingUser = await User.findOne({
        where: {},
        include: [{
          model: Twitter,
          where: {id: profile.id},
        }, Profile],
        raw: true,
        nest: true,
      })

      if (existingUser) return done(null, existingUser)
      else {
        // TODO rework this
        const user = await User.create({})
        const twitter = await Twitter.create({
          UserId: user.id,
          id: profile.id,
          username: profile.username,
          displayName: profile.screen_name,
          image: selectn('photos[0].value', profile),
        })
        const newUser = await User.findById(user.id, {
          include: [Twitter, Profile]
        })
        console.log('newUser: ', newUser);
        done(null, newUser)
      }
    } catch (error) {
      console.error(error);
      done(error)
    }
  }
));

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .get('/twitter', passport.authenticate('twitter'))
  // TODO try disabling redirects
  // https://github.com/jaredhanson/passport-twitter#authenticate-requests
  .get('/twitter/callback',
     passport.authenticate('twitter', { successRedirect: '/',
                                        failureRedirect: '/failed-login' })) // TODO implement failure login route
export default router