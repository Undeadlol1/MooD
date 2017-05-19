import { mustLogin } from '../services/permissions'
import { User } from '../data/models'
import { Router } from 'express'

// routes
const limit = 12

export default Router()
  .get('/user/:username', async function({ params }, res) {
    try {
      const username  = params.username
      if (!username) return res.badRequest('invalid query')

      const user = await User.findOne({where: {username}})
      if (!user) res.boom.notFound('user not found')
      else res.json(user)

    } catch (error) {
      console.error(error)
      res.boom.internal(error)
    }
  })