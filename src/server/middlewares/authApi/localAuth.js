import { Strategy as LocalStrategy } from "passport-local"
import { User, Local, Profile } from 'server/data/models'
import { Router } from "express"
import passport from "passport"

const { URL } = process.env
const router = Router()

router
  .post('/signup',   async function(req, res) {
    const { username, email, password } = req.body
    // TODO test for params
    if(!username || !email || !password) res.status(400).end('Invalid query')
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists

    // TODO add validation tests
    // TODO move everything into user controller!!
    try {
        const existingUser = await Local.findOne({
                                    where: {
                                      $or: [{email}, {username}]
                                  }})
        if (existingUser) res.status(401).end('user already exists')
        else {
          // TODO try include again
          const user = await User.create({}, {raw: true})
          const local = await Local.create({
            email,
            username,
            UserId: user.id,
            password: Local.generateHash(password) // TODO add tests
          }, {raw: true})
          const newUser = await User.findOne({
            where: {id: user.id},
            include: [Local, Profile],
            raw: true,
            nest: true,
          })
          req.login(newUser, error => {
            if (error) throw new Error(error)
            else return res.json(newUser)
          })
        }
    } catch (error) {
        console.error(error)
        res.status(500).end(error)
    }
  })

  .post('/login', async function(req, res) {
      try {
        const {username, password} = req.body
        if(!username || !password) return res.status(400).end('Invalid query')
        // TODO this
        const email = username
        const user =  await User.findOne({
                        where: {},
                        include: [Profile, {
                          model: Local,
                          where: { $or: [{email}, {username}] },
                        }],
                      })
        if (!user) {
          return res.status(401).end('User not exists')
        }
        if (!user.Local.validPassword(password)) {
          const newLocal = await Local.findById(user.Local.id)
          return res.status(401).end('Incorrect password')
        }
        req.login(user, error => {
          if (error) throw new Error(error)
          else return res.json(user)
        })
      } catch (error) {
          console.error(error)
          res.status(500).end(error)
      }
  })
  // TODO tests
  .get('/validate/:username', async (req, res) => {
    const {username} = req.params
    const user = await Local.findOne({
      where: {
        $or: [{username}, {email: username}]
      },
      raw: true,
    })
    res.json(user || {})
  })

export default router