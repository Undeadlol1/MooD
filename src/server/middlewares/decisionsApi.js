import { Node, Mood, Decision, User } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'
import { Router } from 'express'

export default Router()
  /*
    When user makes a decision we need to:
    1. Create a Decision
    2. Update Node.rating
  */
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const { id: UserId } = user,
            { NodeId, vote } = body,
            node = await Node.findById(NodeId),
            newRating = Number(node.rating) + (vote ? 1 : - 1)

      // 1. Create a Decision
      const decision = await Decision.create({
        vote,
        NodeId,
        UserId,
        MoodId: node.MoodId,
        NodeRating: newRating,
      })
      // 2. Update Node.rating
      await node.increment(
        { rating: newRating },
        { where: { id: NodeId } }
      )
      // send response
      res.json(decision)
    } catch (error) {
      console.error(error)
      res.boom.internal(error.message)
    }
  })
  /*
    When user changes decision we need to:
    1. Update a Decision
    2. Update Node.rating
  */
  .put('/:id', mustLogin, async ({user, body, params}, res) => {
    try {
      const { id: UserId } = user,
            decision = await Decision.findById(params.id),
            node = await Node.findById(decision.NodeId),
            newRating = Number(node.rating) + (body.vote ? 1 : -1)
      // Update Node.rating
      await node.increment(
        { rating: newRating },
        { where: { id: node.id } }
      )
      // update decision
      res.json(
        await decision.update({
          vote: body.vote,
          NodeRating: newRating,
        })
      )
    } catch (error) {
      console.error(error)
      res.boom.internal(error.message)
    }
  })
  // FIXME: should i even delete decision? Is it going to break anything
  /*
    When user removes decision:
    1. Delete a Decision
    2. Update Node.rating
  */
  .delete('/:id', mustLogin, async ({user, body, params}, res) => {
    try {
      const decision = await Decision.findById(params.id),
            node = await Node.findById(decision.NodeId),
            newRating = Number(node.rating) - 1
      // document was not found
      if (!decision) return res.status(204).end()
      // user must be documents owner to delete it
      if (decision && decision.UserId == user.id) {
        await decision.destroy()
        await node.update(
          { rating: newRating }
        )
        await res.status(200).end()
      }
      else res.boom.unauthorized('You must be the owner to delete this')
    } catch (error) {
      res.status(500).end(error)
    }
  })