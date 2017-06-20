import { Node, Mood, Decision, User } from '../data/models'
import { mustLogin } from '../services/permissions'
import { parseUrl } from '../../shared/parsers'
import extend from 'lodash/assignIn'
import sequelize from "sequelize"
import { Router } from "express"
import { parse as parseQuery } from 'query-string'
import isEmpty from 'lodash/isEmpty'
import YouTube from 'youtube-node'
/*
  ⚠️ note about YouTube API ⚠️
  currently youtube key works only on specific IP's
  so, when multi server infrastructure is created ither
  add server IP addresses in YouTube dashboard,
  or bound key to website URL and move YT search to client
*/
const youTube = new YouTube();
youTube.setKey(process.env.YOUTUBE_KEY);
youTube.addParam('type', 'video')
youTube.addParam('videoEmbeddable', true)

// routes
export default Router()
  .get('/search', async function(req, res) {
    try {
      const selector = req.query.query // TODO rework this ✏️
      if (!selector || isEmpty(selector)) return res.boom.badRequest('invalid query')
      youTube.search(selector, 3,
        (error, result) => {
          if (error) throw error
          else res.json(result.items)
      });
    } catch (error) {
      console.error(error);
      res.boom.internal(error)
    }
  })