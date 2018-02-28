import 'babel-polyfill'
import chai, { should, expect, assert } from 'chai'
import request from 'supertest'
import server from '../../server'
import { Mood, User, Node, Decision } from '../../data/models'
import slugify from 'slug'
import uniq from 'lodash/uniq'
import forEach from 'lodash/forEach'
import users from '../../data/fixtures/users'
import { loginUser } from './authApi.test'
import { stringify } from 'query-string'
chai.use(require('chai-datetime'));
chai.should();

// TODO check this constants
const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        moodName = "random name",
        moodSlug = slugify(moodName),
        url = "https://www.youtube.com/watch?v=hDH7D8_31X8",
        urls = [
            "https://www.youtube.com/watch?v=nBwHtgQH2EQ",
            "https://www.youtube.com/watch?v=l5-gja10qkw",
            "https://www.youtube.com/watch?v=M3B5U1S-I4Y",
            "https://www.youtube.com/watch?v=P027oGJy2n4",
            "https://www.youtube.com/watch?v=VoA9tLkrgHY",
        ],
        contentId = 'Seh57NRnAVA'


function login() {
    return agent
        .post('/api/auth/login')
        .send({ username, password })
        .expect(200)
}

export default describe('/nodes API', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
        // login user
        await login()
    })

    // clean up
    after(function() {
        server.close()
    })

    it('POST node', async function() {
        const mood = await Mood.findOne({order: 'rand()'})
        const moodSlug = mood.slug
        function postNode(body) {
            return agent
                    .post('/api/nodes')
                    .send(body)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(res => res.body)
        }
        const withUrlResponse = await postNode({moodSlug, url})
        withUrlResponse.url.should.be.equal(url)
        const withoutUrlResponse = await postNode({
                                            moodSlug,
                                            contentId,
                                            type: 'video',
                                            provider: 'youtube',
                                        })
        withoutUrlResponse.contentId = contentId
    })

    it('POST should fail if node is a duplicate', async function() {
        const existingNode = await Node.findOne({order: 'rand()', raw: true})
        await agent
            .post('/api/nodes')
            .send({
                MoodId: existingNode.MoodId,
                provider: existingNode.provider,
                contentId: existingNode.contentId,
            })
            .expect(400)
            .then(({body}) => {
                expect(body.message).to.eq('node already exists')
            })
    })

    function getNextNode(slug, previousNodeId = "", agent = user) {
        return agent
            .get(`/api/nodes/${slug}/${previousNodeId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
    }

    // make 10 subsequent node requests
    async function cycleThroughNodes(slug, nodeId) {
            let nextNodeId = nodeId
            const nodeIds = []
            for(var x = 0; x < 10; x++) {
                const nextNode = await getNextNode(slug, nextNodeId)
                // console.log('nextnode', nextNode)
                nextNodeId = nextNode.id
                nodeIds.push(nextNode.id)
            }
            return nodeIds
    }

    describe('GET /:moodSlug/:nodeId?', function() {
        // it('GET single node', async function() {
        //     const mood = await Mood.findOne({order: 'rand()'})
        //     const node = await getNextNode(mood.slug)
        //     node.url.should.be.string
        // })

        // it('should fail without proper moodSlug', async function() {
        //     await user
        //             .get('/api/nodes/' + 'this_not_exists')
        //             .expect(404)
        //             .then(res => {
        //                 assert(res.error.text == 'mood not found')
        //             })
        // })
    })


    // it('nodes cycle properly for unlogged user', async function() {
    //     try {
    //         // logout user
    //         await user.get('/api/auth/logout').expect(200)

    //         const mood = await Mood.findOne()
    //         const initialNode = await getNextNode(mood.slug)
    //         const nodeIds = await cycleThroughNodes(mood.slug, initialNode.id)
    //         // TODO
    //         // expect(uniq(nodeIds).length, 'unique nodes').to.be.above(6)
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // })

    // // TODO check this tests
    // it('nodes cycle properly for logged in user', async function() {
    //     try {
    //         const agent = await login()

    //         const mood = await Mood.findOne({order: 'rand()'})
    //         const node = await getNextNode(mood.slug)
    //         const nodeIds = await cycleThroughNodes(mood.slug, undefined, agent)

    //         expect(uniq(nodeIds), 'unique nodes').to.not.be.equal(1)
    //     } catch (error) {
    //         console.error(error)
    //         throw new Error(error)
    //     }
    // })

    // describe('/validate/:MoodId/:contentId', async function() {
    //     const route = '/api/nodes/validate/'
    //     try {
    //         it('fails without "MoodId"', async function() {
    //             await user.get(route).expect(404)
    //         })
    //         it('fails without "contentId"', async function() {
    //             const mood = await Mood.findOne({order: 'rand()'})
    //             await user.get(route + mood.id).expect(404)
    //         })
    //         it('fails with "contentId" but no "MoodId', async function() {
    //             const node = await Node.findOne({order: 'rand()'})
    //             await user.get(route + "/" + node.id).expect(500)
    //         })
    //         it('gets response properly', async function() {
    //             const mood = await Mood.findOne({order: 'rand()'})
    //             const node = await Node.findOne({
    //                                 order: 'rand()',
    //                                 where: {MoodId: mood.id}})
    //             await user
    //                     .get(`${route}${mood.id}/${node.contentId}`)
    //                     .expect(200)
    //                     .expect('Content-Type', /json/)
    //                     .then(({body}) => {
    //                         expect(body.id).to.be.equal(node.id)
    //                         expect(body.MoodId).to.be.equal(node.MoodId)
    //                     })
    //         })
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // })


    // TODO rework this
    // TODO do this (or nove this in decisionsApi.test?)
    // it('changes Decision properly', async function() {
    //     await login()

    //     const currentDate = new Date()
    //     const mood = await Mood.findOne({order: 'rand()'})
    //     const firstNode = await getNextNode(mood.slug)

    //     // this is needed to make a change to firstNode
    //     // (because node changes on second request to api)
    //     await getNextNode(mood.slug, firstNode.id)

    //     const updatedDecision = await Decision.findById(firstNode.Decision.id)
    //     // console.log('updatedDecision', updatedDecision.dataValues)
    //     expect(updatedDecision.position).to.not.be.equal("0")
    //     // expect(updatedDecision.lastViewAt).to.be.beforeTime(currentDate) // TODO is this true?
    //     // expect(updatedDecision.position > 0).to.be.true
    // })


    /*
        FAILURE TESTS
    */
    // describe('fails to PUT if', () => {
    //     it('id was not provided', async () => await agent.put('/api/threads').expect(404))
    //     it('user is not logged in', async () => await agent.put('/api/threads/id').expect(401))
    //     it('user is diffrent', async () => {
    //         const thread = await Threads.findOne({where: {parentId: forumId}})
    //         const user = await loginUser(users[1].username, users[1].password)
    //         await user.put('/api/threads/' + thread.id).send({name, text}).expect(403)
    //     })
    //     it('thread does not exist', async () => {
    //         const user = await loginUser(username, password)
    //         await user
    //             .put('/api/threads/' + generateUuid()) // <- proper but non existing document ID
    //             .send({name, text}) // proper payload
    //             .expect(204) // 'No Content' status code
    //     })
    //     // Run PUT requests with different values and make sure there is a proper error message for it.
    //     forEach(
    //         [
    //             // FIXME: what about nulls?
    //             // {property: 'name', value: null, error: 'Name is required'},
    //             {property: 'text', value: undefined, error: 'Is required'},
    //             {property: 'text', value: '', error: 'Text should be atleast 5 characters long'},
    //             {property: 'text', value: ' ', error: 'Text should be atleast 5 characters long'},
    //         ],
    //         ({property, value, error}) => {
    //             it(`${property} not validated`, async () => {
    //                 const user = await loginUser(username, password)
    //                 await user
    //                 .put('/api/threads/' + generateUuid())
    //                 .send({[property]: value})
    //                 .expect(422)
    //                 .expect('Content-Type', /json/)
    //                 .then(({body}) => expect(body.errors[property].msg).to.eq(error))
    //                 .catch(error => {throw error})
    //             })
    //         }
    //     )
    // })

    describe('fails to POST if', () => {
        // Only logged in users can create threads.
        it('if user is logged in', async () => await agent.post('/api/nodes').expect(401))
        // Run POST requests with different values and make sure there is a proper error message for it.
        forEach(
            [
                // FIXME: what about nulls?
                // NOTE: this might help http://sequelize.readthedocs.io/en/v3/docs/models-definition/#validations
                // {property: 'name', value: null, error: 'Name is required'},
                {property: 'name', value: undefined, error: 'Name is required'},
                {property: 'name', value: '', error: 'Name must be between 5 and 100 characters long'},
                {property: 'name', value: ' ', error: 'Name must be between 5 and 100 characters long'},
                {property: 'text', value: undefined, error: 'Text is required'},
                {property: 'text', value: '', error: 'Text should be atleast 5 characters long'},
                {property: 'text', value: ' ', error: 'Text should be atleast 5 characters long'},
                {property: 'parentId', value: undefined, error: 'Parent id is required'},
                {property: 'parentId', value: '', error: 'Parent id is not valid UUID'},
                {property: 'parentId', value: ' ', error: 'Parent id is not valid UUID'}
            ],
            ({property, value, error}) => {
                it(`${property} not validated`, async () => {
                    console.log('property: ', property);
                    const user = await loginUser(username, password)
                    await user
                    .post('/api/threads')
                    .send({[property]: value})
                    .expect(422)
                    .expect('Content-Type', /json/)
                    .then(({body}) => {
                        console.log('response!');
                        expect(body.errors[property].msg).to.eq(error)
                    })
                    .catch(error => {throw error})
                })
            }
        )
    })


})