import sequelize from 'sequelize'
import express from "express"
import selectn from "selectn"
import { Mood, Node, Decision } from '../data/models'
import { mustLogin } from './permissions'
import slugify from 'slug'

// routes
const router = express.Router(); // TODO refactor without "const"?
router

  .get('/', function(req, res) {
    Mood.findAll({ limit: 5 })
        .then(result => res.json(result))
        .catch(error => res.boom.invalid(error))
  })

  .post('/', mustLogin, function({user: { id: UserId }, body: { name }}, res) {
    Mood.create({ UserId, name, slug: slugify(body.name) }) // TODO move this in model definition?
        .then(result => res.end())
        .catch(error => res.boom.invalid(error))
  })

  .get('/:slug', function(req, res) {
    // console.log(`.get('/:slug'`);
    Mood.findOne({
      where: { slug: req.params.slug},
      // raw: true,
      // include: [{ // TODO abasctract this to Mood method?
      //   model: Node, // TODO add selectors (limit, sort)
      //   as: 'Nodes',
      //   limit: 5,
      //   include: [{
      //     model: Decision,
      //     as: 'Decision',
      //     where: {
      //       nextViewAt: {
      //         $lt: new Date()
      //     },
      //     required: false, // incase there are zero decisions
      //   }]
      // }]
    })
    .then(result => {
      // console.log(JSON.stringify(result));
      // console.log(result.toJSON())
      // console.log(result.dataValues.Nodes);
      // console.log('mood id!!!', result.dataValues.id);
      // console.log(result.dataValues);
      // result.dataValues.Nodes.map(node => console.log(node.dataValues.Decision.dataValues))
      res.json(result)
    })
    // .then(result => res.json(result.dataValues))
    .catch(error => {
      console.error(error);
      res.boom.internal(error)
    })
  })
  
  // .get('/:slug/content', function(req, res) {
  //   Mood.findAll({ where: {} })
  //     .then(result => {
  //       // console.log('mood contentn result', result)
  //       result.getNodes().then(moodNodes => {
  //         console.log('moodNodes', moodNodes);
  //       })
  //     })
  // })

export default router