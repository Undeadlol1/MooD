import extend from 'lodash/assignIn'
import { Node, Decision } from "../models/index"
// TODO add tests! ⚠️ ✏️️
/**
 * after migrating ratings to decimal point (in order to make them unique),
 * not all of them changed properly.
 * This function checks ratings and modifies them to decimal point with Date.now()
 * @export
 * @param {object} node
 */
export async function normalizeRating(node) {
    if (node.rating == '0.00000000000000000' && (node.rating % 1) == 0) {
        console.log('node.rating', node.rating)
        console.log('after point', node.rating % 1)
        console.log('point test', (Number(node.rating + '.' + Date.now())) % 1)
        console.warn('rating is not normal!')
        console.info('Normalizing...')
        const id = node.id
        const newRating = node.rating == '0.00000000000000000'
                        ? Number(0 + '.' + Date.now())
                        : Number(node.rating + '.' + Date.now())
        await Node.update({rating: newRating}, {where: {id}})
        await Decision.update({NodeRating: newRating}, {where: {NodeId: id}})
    }
}
/**
 * find node with highest node.Decision.rating
 * @export
 * @param {string} UserId
 * @param {string} MoodId
 * @param {number} [afterRating] threshold too look after
 * @returns
 */
export async function findHighestRatingNode(UserId, MoodId, afterRating) {
    return await Node.findOne({
    raw: true,
    nest: true,
    where: {}, // TODO comment out?
    include: [{
        model: Decision,
        order: [['rating', 'DESC']],
        where:  extend(
            {UserId, MoodId},
            afterRating
            ?   {
                    rating: {
                        $lt: afterRating
                    }
                }
            : undefined
        ),
    }],
    })
}
/**
 * find node with lowest node.Decision.position
 * @export
 * @param {string} UserId
 * @param {string} MoodId
 * @param {number} [beforePosition] threshold too look before
 * @returns
 */
export async function findHighestPositionNode(UserId, MoodId, beforePosition) {
  return await Node.findOne({
    where: {}, // comment out?
    include: [{
        model: Decision,
        order: [['position', 'DESC']],
        where:  extend(
            {UserId, MoodId},
            beforePosition
            ?   {
                    position: {
                        $gt: beforePosition
                    }
                }
            : undefined
        ),
    }],
  })
}

// export default class {
//     update(selector) {

//     }
// }
