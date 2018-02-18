import 'babel-polyfill'
import slugify from 'slug'
import uniq from 'lodash/uniq'
import request from 'supertest'
import server from 'server/server'
import { stringify } from 'query-string'
import { loginUser } from './authApi.test'
import users from 'server/data/fixtures/users'
import chai, { should, expect, assert } from 'chai'
import { Mood, User, Local, Node, Decision } from 'server/data/models'
chai.use(require('chai-datetime'))
chai.should()

const   agent = request.agent(server),
        apiUrl = '/api/decisions/',
        user = users[0],
        vote = true

export default describe('/decisions API', function() {
    // Kill supertest server in watch mode to avoid errors
    before(() => server.close())

    describe('POST', async function() {

        it('creates decision', async function() {
            const node = await Node.findOne({order: 'rand()'})
            const loggedIn = await loginUser(user.username, user.password)
            await
            loggedIn
            .post(apiUrl)
            .send({vote, NodeId: node.id})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(async ({body}) => {
                expect(body.vote).eq(true)
                // TODO: check this
                // FIXME: check this
                Number(node.rating) > 0
                ? expect(body.NodeRating).above(node.rating)
                : expect(body.NodeRating).below(node.rating)
                // make sure node.rating is updated
                const updatedNode = await Node.findById(node.id)
                expect(updatedNode.rating == body.NodeRating)
            })
        })

        it('fails if not logged in', async () => await agent.post(apiUrl).expect(401))
    })

    describe('PUT', async function() {

        it('updates decision', async function() {
            const   UserId = await Local
                            .findOne({where: {username: user.username} })
                            .then(local => local.UserId),
                    decision = await Decision.findOne({where: {UserId}}),
                    node = await Node.findById(decision.NodeId),
                    agent = await loginUser(user.username, user.password)
            await agent
                .put(apiUrl + decision.id)
                .send({vote: !decision.vote})
                .expect(200)
                .expect('Content-Type', /json/)
                .then(async ({body}) => {
                    expect(body.vote).eq(!decision.vote)
                    // TODO check this
                    Number(node.rating) > 0
                    ? expect(body.NodeRating).below(node.rating)
                    : expect(body.NodeRating).abowe(node.rating)
                    // make sure node.rating is updated
                    const updatedNode = await Node.findById(node.id)
                    expect(updatedNode.rating == body.NodeRating)
                })
        })

        it('fails if not logged in', async () => await agent.put(apiUrl + 'someId').expect(401))

    })

    describe('DELETE', async function() {
        let decisionId
        let nodeId
        let oldRating

        it('has document before request is made', async () => {
            const   UserId = await Local
                            .findOne({where: {username: user.username} })
                            .then(local => local.UserId),
                    decision = await Decision.findOne({where: {UserId}}),
                    node = await Node.findById(decision.NodeId)
            // set variables for next tests
            decisionId  = decision.id
            nodeId      = decision.NodeId
            oldRating   = node.rating
            // test
            assert.isNotNull(decision)
        })

        it('deletes decision', async () => {
            const request = await loginUser(user.username, user.password)
            await request
                .delete('/api/decisions/' + decisionId)
                .expect(200)
            assert.isNull(
                await Decision.findById(decisionId),
                'document was not deleted'
            )
        })

        it('updates Node.rating', async () => {
            assert.isBelow(
                await Node
                .findById(nodeId)
                .then(node => node.rating),
                oldRating,
            )
        })

        it('fails if not authorized', async () => {
            await agent.delete('/api/decisions/someId').expect(401)
        })
    })
})