import 'babel-polyfill'
import slugify from 'slug'
import colors from 'colors'
import uniq from 'lodash/uniq'
import request from 'supertest'
import server from 'server/server'
import { stringify } from 'query-string'
import { loginUser } from './authApi.test'
import chai, { should, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Mood, User, Node, Decision } from 'server/data/models'
chai.use(require('chai-datetime'));
chai.should();

const agent = request.agent(server)
const apiUrl = '/api/decisions/'

export default describe('/decisions API', function() {

    before(function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    // clean up
    after(function() {
        server.close()
    })


    describe('POST decision', async function() {
        const route = '/api/externals/search'

        it('fails if not logged in', async function() {
            await agent.post(apiUrl).expect(401)
        })

        // it('fails without "selector"', async function() {
        //     await user.get(`${route}?`).expect(400)
        // })

        it('handles upvote', async function() {
            const user = users[0]
            const node = await Node.findOne({order: 'rand()'})
            const loggedIn = await loginUser(user.username, user.password)
            await loggedIn
                    .post(apiUrl)
                    .send({
                        vote: true,
                        NodeId: node.id,
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .then(({body}) => {
                        expect(body.vote).eq(true)
                        Number(node.rating) > 0
                        ? expect(body.NodeRating).above(node.rating)
                        : expect(body.NodeRating).below(node.rating)
                    })
        })
    })

})