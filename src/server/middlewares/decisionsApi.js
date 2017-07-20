import { Node, Mood, Decision, User } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'
import { Router } from "express"

export default Router()
  .post('/', mustLogin, async function({user, body}, res) {

    /*
      When user makes a decision we need to:
      1. Update Node.rating
      2. Update Decision.vote and Decision.NodeRating
      3. Update all decision's NodeRating with new Node.rating
    */

    const { id: UserId } = user
    const { NodeId, rating, vote } = body

    try {
      const node = await Node.findById(NodeId)
      const where = {
                      NodeId,
                      UserId,
                      MoodId: node.MoodId
                    }
      const NodeRating = Number(node.rating) + (vote ? 1 : -1)
      const defaults = {
                          vote,
                          NodeRating
                        }

      // 1. Update Node.rating
      await node.increment({ rating: defaults.NodeRating }, { where: { id: NodeId } }) // do i actually need to specify id?

      // 2. Update Decision.vote and Decision.NodeRating
      await Decision.findOrCreate({where, defaults})
      await Decision.update({...defaults}, {where})

      // 3. Update all decision's NodeRating with new Node.rating
      const users = await User.findAll()
      await users.forEach(user => {
        return Decision.findOrCreate({
         where,
         defaults: { NodeRating }
        })
      })

      const reponse = await Decision.findOne({where})

      res.json(reponse)
    } catch (error) {
      console.error(error)
      res.boom.internal(error.message)
    }
  })