import express from "express"
import selectn from "selectn"
import sequelize from 'sequelize'
import { Node, Mood, Decision, User } from '../data/models'
import { mustLogin } from './permissions'
import slugify from 'slug'
import { assignIn as extend } from 'lodash'

function findMoodIdBySlug(slug) { // TODO extend Mood with this function
    return Mood
            .findOne({ where: { slug }})
            // .then(result => selectn('dataValues.id', result))
            .then(result => result && result.get('id'))
}

// routes
const router = express.Router()

router

  // for forms validation
  // .get('/:moodSlug/validate', async function(req, rs) {

  // })

  .get('/:moodSlug/:nodeId?', async function({ params, user }, res) {
    console.log('params', params)
    try {
      let response      
      const MoodId = await findMoodIdBySlug(params.moodSlug)
      const previousNode = await Node.findById(params.nodeId) // IMPLEMENT THIS IN NODE ACTIONS
      const nodeWithBiggestRating = await Node.findOne({ // move this to bottom?
            where: { MoodId },
            order: [['rating', 'DESC']]            
          })

      if (!MoodId) return res.boom.notFound()

      /* USER IS NOT LOGGED IN */
      if (!(user && user.id)) {
        /* PREVIOUS NODE IS PROVIDED */                
        if (previousNode) {
          console.log('moodId', MoodId)
          response = await Node.findOne({
            where: {
              MoodId,
              rating: { $lte: previousNode.rating },
              id: { $not: previousNode.id }
            },
            order: [['rating', 'DESC']]
          })
          if (!response) response = nodeWithBiggestRating // move this to bottom?
          // console.log('node with no user and with no previous node', response.dataValues);
        }
        /* NO PREVIOUS NODE PROVIDED */        
        else {
          response = nodeWithBiggestRating  // move this to bottom?
          // console.log('node with no user and with previous node', response.dataValues);
        }
      }


      /* USER IS LOGGED IN */     // IMPLEMENT THIS 
      else {// IMPLEMENT THIS // DO NOT FORGET TO IMPLEMENT DECISIONS ON USER CREATION       
        const UserId = user.id
        // const decision = await Decision.findOne({
        //   where: {
        //       UserId,
        //       MoodId,
        //       rating: { $gre: 0 },
        //       // nextViewAt: { $lte: new Date() }
        //   }
        // })
        // console.log('decision', decision)
        const where = {
              UserId,
              MoodId,
              rating: { $gte: 0 },
              nextViewAt: { 
                $or: {
                  $lte: new Date(),
                  $not: null // WHAT ABOUT THIS?
                }
               }
            }

        if (previousNode) {
          where.NodeRating = {
            $lte: previousNode.rating
          }
          where.NodeId = {
            $not: previousNode.id
          }
        }

        response = await Node.findOne({
          include: [{
            where,
            model: Decision,
            // order: [['NodeRating', 'DESC']] // // change order? // WHAT ABOUT THIS?
          }]
        })

        // if ()


      }
      // console.log('response', response && response.dataValues)
      res.json(response || nodeWithBiggestRating)      
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })
  /*
    rework this so "where" parameter is determinated on whatever user is logged in or not
  */

  .get('/BULLSTHIT/:moodSlug/', async function({ params, user, isAuthenticated }, res) {// :rating
    /*
      When user fetches node we need to:
      1. Determine if user is logged in or not
        a. If he is not logged in, then find Node with biggest rating after param.rating
        b. If he is logged in, then Find decision with rating more then 0 (positive rating)
        and biggest NodeRating with nextViewAt not null
        or nextViewAt is less then today
        (use order?)
      
        IMPORTANT WE NEED TO show Decision with biggest rating and nextViewAt not .now()! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!


        where: {
          rating: {
            $mre: 0
          },
          nextViewAt: {
            $lte: new Date
          },
        },
        sort: {
          NodeRating,
          nextViewAt
        },
        limit: 5


      Questions:
      1. What if user is not logged in?
      2. What if user doesn't have any decisions?
    */
    if (!params.moodSlug) return res.boom.badQuery()
    try {
      const UserId = user && user.id
      const MoodId = await findMoodIdBySlug(params.moodSlug)
      // const node = await Node.findAll({
      //   where: {
      //     // UserId: user.id,
      //     // MoodId, // TODO add migration to resolve moodId
      //     // nextViewAt: {
      //     //   $lte: new Date()
      //     // },
      //   },
      //   // Find all projects with a least one task where task.state === project.task
      //   include: [{
      //     model: Decision,
      //     where: {
      //               MoodId,
      //               UserId,
      //               rating: { $mre: 0 },
      //               nextViewAt: { $lte: new Date() },
      //           },
      //     // sort: ['NodeRating', 'nextViewAt'],
      //     // limit: 5
      //   }]
      // })
      const decision = await Decision.findOne({ // .findAll
            where: {
              MoodId,
              UserId,
              rating: { $gte: 0 },
              nextViewAt: { $lte: new Date() },
          },
          // group: 'NodeRating',
          order: [
            ['NodeRating', 'DESC'],
            ['nextViewAt', 'DESC']
          ],
          limit: 1,
          // iclude: [{ model: Node, as: 'node' }]
      })
      console.log('decision', decision);
      if (decision) {
        const node = await Node.findOne({
          where: {
            id: decision.NodeId
            // $or: [
            //   { id: decision && decision.NodeId },
            //   { rating:  }
            // ]
            // 
          },
          iclude: [{ model: Decision, as: 'decision' }]
        })
        const newDecision = await Decision.findOne({
          where: {
            UserId,
            MoodId,
            NodeId: node.id
          }
        })
        // console.log(newDecision.dataValues);
        node.Decision = newDecision
        // console.log('node', node.dataValues);
        const response = {
          ...node.dataValues,
          Decision: newDecision.dataValues
        }
        // console.log(response);
        res.json(response)
      }
      else {
        console.log('else is being used!');
        const node = await Node.findOne({
          where: { MoodId },
          order: [['rating', 'DESC']],
        })
        res.json(node)
      }
      // console.log(decision);
      // decision.forEach(decision => {
      //   console.log('hours', decision.dataValues.nextViewAt.getHours());        
      //   console.log('minutes', decision.dataValues.nextViewAt.getMinutes());
      // })
      // console.log(decision.dataValues)
      // res.json(decision)
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })

  .post('/', mustLogin, async function({user, body}, res) {
    /*
      When user creates a node do the following:
      1. Create Node
      2. Create a Decision for every User corresponding with this NodeId
    */
    try {
      const MoodId = await findMoodIdBySlug(body.moodSlug)
      extend(body, { MoodId, UserId: user.id })
      const node   = await Node.create(body)
      const users  = await User.findAll()

      await users.forEach(user => {
            return Decision.create({
                      UserId: user.get('id'),
                      NodeId: node.get('id'),
                      MoodId: node.get('MoodId'),
                    })
      })

      res.end()
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })

export default router