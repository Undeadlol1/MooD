import slugify from 'slug'
import uniq from 'lodash/uniq'
import request from 'supertest'
import server from 'server/server'
import generateUuid from 'uuid/v4'
import { stringify } from 'query-string'
import { loginUser } from './authApi.test'
import users from 'server/data/fixtures/users'
import chai, { should, expect, assert } from 'chai'
import { Mood, User, Local, Node, Decision } from 'server/data/models'
chai.use(require('chai-datetime'))
chai.should()

const   vote = true,
        user = users[0],
        NodeId = 1111111,
        apiUrl = '/api/decisions/',
        agent = request.agent(server)
/**
 *
 * @param {object} body request body
 * @param {object} nodeBody body of created node
 */
async function makePostRequest(body, nodeBody={}) {
    // Create node for testing.
    const node = await Node.create({
        id: NodeId,
        MoodId: 12345,
        rating: '12.02223', // This is important.
        provider: 'youtube',
        UserId: generateUuid(),
        contentId: 'm2uTFF_3MaA',
        url: 'https://www.youtube.com/watch?v=m2uTFF_3MaA',
        ...nodeBody,
    })
    // Make logged in request.
    const loggedIn = await loginUser(user.username, user.password)
    return await
        loggedIn
            .post(apiUrl)
            .send(body)
            // Verify response headers.
            .expect(200)
            .expect('Content-Type', /json/)
            // Verify results.
            .then(req => req.body)
}

export default describe('/decisions API', function() {
    // Kill supertest server in watch mode to avoid errors.
    before(() => server.close())
    // Clean up tables.
    after(async () => await Node.destroy({where: {id: NodeId}}))

    describe('POST', async function() {
        /**
         * Upon creating decision API must:
         * 1) Update Decision.vote value
         * 2) Increment or decrement Node.rating based on vote.
         *    If vote = true, increment by one,
         *    If false, decrement by one.
         * 3) Update Deceision.NodeRating the same way.
         *    NOTE: this is a mess a must be reworked in the future.
         */
        it('creates decision', async function() {
            console.warn('DONT FORGET TO FIX RATINGS')
            // Make request.
            const decision = await makePostRequest(
                { vote, NodeId }, // Request body.
                { rating: '12.02223' } // Node body.
            )
            // Verify results.
            const updatedNode = await Node.findById(NodeId)
            // Hardcoded values are used to make sure that
            // javascript's decimal calculation system did not mess anything up.
            assert(updatedNode.rating == '13.02223')
            // node.rating and decision.NodeRating must be equal.
            assert.equal(updatedNode.rating, decision.NodeRating)
        })

        it('fails if not logged in', async () => await agent.post(apiUrl).expect(401))
    })

    describe('PUT', async function() {

        it('updates decision', async function() {
            const   UserId = await Local
                            .findOne({where: {username: user.username} })
                            .then(local => local.UserId),
                    oldDecision = await Decision.findOne({where: {UserId}}),
                    node = await Node.findById(oldDecision.NodeId),
                    agent = await loginUser(user.username, user.password)
            await agent
                .put(apiUrl + oldDecision.id)
                .send({vote: !oldDecision.vote})
                .expect(200)
                .expect('Content-Type', /json/)
                .then(async ({body}) => {
                    const decision = body
                    expect(decision.vote).eq(!oldDecision.vote)
                    // TODO check this
                    Number(node.rating) > 0
                    ? expect(decision.NodeRating).below(node.rating)
                    : expect(decision.NodeRating).abowe(node.rating)
                    // make sure node.rating is updated
                    const updatedNode = await Node.findById(node.id)
                    assert.equal(
                        updatedNode.rating, decision.NodeRating,
                        'node.rating and decision.NodeRating must be equal'
                    )
                    assert.notEqual(
                        node.rating, updatedNode.rating,
                        'node.rating must change'
                    )
                    // test how much rating have changed
                    // to prevent wrong calculation
                    assert(
                        updatedNode.rating - decision.NodeRating < 2,
                        'updated node rating is too high'
                    )
                })
        })

        it('fails if not logged in', async () => await agent.put(apiUrl + 'someId').expect(401))

    })
    // FIXME: precise rating calculation tests
    describe('DELETE', async function() {
        let nodeId
        let oldRating
        let decisionId

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