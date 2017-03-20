import express from "express"
import selectn from "selectn"
import { Node, Mood, Decision } from '../data/models'
import { mustLogin } from './permissions'
import { assignIn as extend } from 'lodash'

const router = express.Router(); // TODO refactor without "const"?

// TODO add comments

router
  .post('/', mustLogin, function({user, body}, res) {
    // TODO add body validators or just wrap everything in try/catch
    const { id: UserId } = user
    const { NodeId, rating } = body
    const nextViewAt = new Date()
    const where = { NodeId, UserId }
    const defaults = {
      rating,
      nextViewAt,
    }

    Decision // using .findOrCreate => .update instead of upsert because Sequelize is buggy with upsert // TODO move upsert in model definition?
      .findCreateFind({ where, defaults }) // TODO try .upsert again
      .then((result) => Decision.update(defaults, { where }))
      .then(result => {
        // console.log(result);
        return Node.findById(NodeId)
      })
      .then(result => {

        const previousRating = result.dataValues.rating
        // console.log(object);
        let newRating = rating;
        if ((rating > 0 && previousRating < 0) && (rating < 0 && previousRating > 0)) newRating = Math.abs(previousRating) * -1 //  || rating < 0 && previousRating < 0
        else newRating = newRating - previousRating
        return result.increment({ rating: newRating }, { where: { id: NodeId } }) // TODO rework this if value is 0

      })
      .then(result => {
        console.log('result after', result);
        return result
      })
      .then(() => res.end())
      .catch(error => {
        console.log('defaults', defaults);
        console.error(error);
        res.boom.internal(error.message)
      })
  })

export default router