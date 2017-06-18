import { Strategy as LocalStrategy } from "passport-local"
import { User, Profile } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'

const { URL } = process.env

/* LOCAL AUTH */
passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
    if(!username || !password) throw new Error('forgot credentials') // TODO this
    User.findOne({ where: { username }})
        .then(user => {
            if (!user) {
              return done(null, false, { message: 'Username not found' });
            }
            if (!user.validPassword(password)) {
              return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        })
        .catch(error => done(error))
  }
));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true },
    function(req, username, password, done) {
      process.nextTick(function() {
        if(!username || !password) throw new Error() // TODO this
          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({where: { username }})
              .then(user => {
                // console.log('user', user)
                if (user) {
                    throw new Error()
                    // return done(null, false);//, req.flash('signupMessage', 'That username is already taken.')
                } else {
                  User.create({
                    username,
                    image: '/userpic.png',
                    password: User.generateHash(password),
                    Profile: {}
                  }, {include: [Profile]})
                  .then(newUser => done(null, newUser))
                  .catch(error => {
                    console.error(error)
                    done(error)
                  })
                }
              })
              .catch(error => {
                console.log(error)
                done(error)
              })
    });
}));

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/xxx', // redirect back to the signup page if there is an error // TODO add failure redirect
    failureFlash : true // allow flash messages
  }))

  .post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/xxxx', // redirect back to the signup page if there is an error // TODO add failure redirect
    failureFlash : true // allow flash messages
  }))

export default router