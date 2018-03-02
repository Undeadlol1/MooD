import find from 'lodash/find'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import matches from 'lodash/matches'
import extend from 'lodash/assignIn'
import includes from 'lodash/includes'
import { Node, Decision } from "server/data/models"
// TODO add tests! ⚠️ ✏️️
/**
 * after migrating ratings to decimal point (in order to make them unique),
 * not all of them changed properly.
 * This function checks ratings and modifies them to decimal point with Date.now()
 * @export
 * @param {object} node
 */
export async function normalizeRating(node) {
    if (node.rating.includes('.00000000000000000') && (node.rating % 1) == 0) {
        console.log('node.rating', node.rating)
        console.log('after point', node.rating % 1)
        console.log('point test', (Number(node.rating + '.' + Date.now())) % 1)
        console.warn('rating is not normal!')
        console.info('Normalizing...')
        const id = node.id
        const newRating = node.rating.includes('.00000000000000000')
                        ? Number(0 + '.' + Date.now())
                        : Number(node.rating + '.' + Date.now())
        await Node.update({rating: newRating}, {where: {id}})
        await Decision.update({NodeRating: newRating}, {where: {NodeId: id}})
    }
}
/**
 * find node with highest node.Decision.rating
 * @export
 * @param {string} MoodId
 * @param {string} [UserId]
 * @param {number} [afterRating] threshold too look after
 * @returns
 */
export async function findHighestRatingNode(MoodId, UserId, afterRating) {
    // using extend function to have clean object and
    // avoid things like {UserId: undefined}, which gets unexpected results from DB
    const where = extend(
        {MoodId},
        // UserId && {UserId},
        afterRating && {
            rating: {
                $lt: afterRating
            }
        },
    )

    return await Node.findOne({
        where,
        limit: 1,
        raw: true,
        nest: true,
        order: [['rating', 'DESC']],
        // include: [{
        //     where,
        //     model: Decision,
        //     order: [['rating', 'DESC']],
        // }],
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

export async function findRandomNode(MoodId) {
  return await Node.findOne({
    where: {MoodId},
    order: 'rand()',
  })
}

export async function findRandomNodes(MoodId) {
  const nodes = await Node.findAll({
    raw: true,
    nest: true,
    where: {MoodId},
    order: 'rand()',
    limit: 100,
    include: [Decision],
  })
  /*
    remove downvoted by user nodes
    (i could not make sequelize to filter data by children values,
    so had to filter manually)
  */
  return nodes.filter(node => {
      const { vote } = node.Decision
      return !(vote == 0 || vote === false)
  })
}
/**
 * This function must find nodes with same
 * 'MoodId', 'contentId', 'provider' and 'type' fields.
 * It will delete all of the except one.
 * @export
 */
export async function removeDuplicates() {
    try {
        // prepare array for ids to delete
        const idsToDelete = []
        const allNodes = await Node.findAll({raw: true})
        // find duplicates and push their id's into array
        allNodes.forEach(({contentId, MoodId, provider}) => {
            const where = {contentId, MoodId, provider}
            // nodes with same contentId, provider and MoodId
            const similarNodes = filter(allNodes, matches(where))
            // if there are duplicates
            if (similarNodes.length > 1) {
                // destroy nodes until only one left
                for (let i = 0; i < similarNodes.length - 1; i++) {
                    // await Node.destroy({where: {id: similarNodes[i].id}})
                    idsToDelete.push(similarNodes[i].id)
                }
            }
        })
        // destroy duplicates
        await Node.destroy({
            where: {id: idsToDelete}
        })
    } catch (error) {
        throw error
    }
}
/**
 * Resets Node.rating and Decision.NodeRating.
 * NOTE: there is not proper tests for this function!
 * @export
 */
export async function resetRatings() {
    /**
    * To reset node.rating we need to:
    * 1) Change rating to 0 + random numbers in every node to make it unique (see: logic.md).
    * 2) Change decision.NodeRating to same number
    * 3) Change every decision.vote to null
    */
    try {
        await Node
        .findAll({where: {}})
        .each(async node => {
            // 0. + timestamp + random integer between 1 and 10k
            const newRating = `0.${Date.now()}${Math.floor(Math.random() * (10000 - 1) + 10000)}`
            await node.update({rating: newRating})
            await Decision.update({NodeRaing: newRating}, {where: {NodeId: node.id}})
        })
        return await Decision.update({vote: null}, {where: {}})
    }
    catch (error) {
        throw error
    }
}