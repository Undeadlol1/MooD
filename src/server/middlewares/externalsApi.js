import { Node, Mood, Decision, User } from '../data/models'
import { mustLogin } from '../services/permissions'
import { parseUrl } from '../../shared/parsers'
import { YOUTUBE_KEY } from '../../../config'
import { assignIn as extend } from 'lodash'
import sequelize from "sequelize"
import { Router } from "express"
import { parse as parseQuery } from 'query-string'
import { isEmpty } from 'lodash'
import YouTube from 'youtube-node'

const youTube = new YouTube();
youTube.setKey(YOUTUBE_KEY);

// routes
export default Router()
  .get('/search', async function(req, res) {
    try {
      const selector = req.query
      if (!selector || isEmpty(selector)) return res.boom.badRequest('invalid query')
      youTube.search(selector, 3,
        (error, result) => {
          if (error) throw error
          else res.json(result)
      });
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })