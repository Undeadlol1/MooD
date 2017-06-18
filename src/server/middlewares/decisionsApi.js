import { Node, Mood, Decision, User } from '../data/models'
import { mustLogin } from '../services/permissions'
import extend from 'lodash/assignIn'
import { Router } from "express"
import selectn from "selectn"

// TODO add comments

export default Router()
  // TODO change to 'put'
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
      console.log('NodeId: ', NodeId);
      const where = {
                      NodeId,
                      UserId,
                      MoodId: node.MoodId
                    }
      // const nextViewAt = new Date().setDate(new Date().getDate() + 1) // tommorow // TEST VALUE
      const NodeRating = Number(node.rating) + (vote ? 1 : -1)
      const defaults = {
                          vote,
                          // nextViewAt,
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

      // TODO change Decision.position

      const reponse = await Decision.findOne({where})

      res.json(reponse)
    } catch (error) {
      console.error(error)
      res.boom.internal(error.message)
    }
  })