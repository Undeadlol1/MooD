import 'babel-polyfill'
import chai, { should, expect } from 'chai'
import request from 'supertest'
import server from '../../server'
import { Mood, User, Node } from '../../data/models'
import slugify from 'slug'
import { uniq } from 'lodash'
chai.should();

const   user = request.agent(server),
        username = "somename",
        password = "somepassword",
        moodName = "random name",
        slug = slugify(moodName),
        url = "https://www.youtube.com/watch?v=hDH7D8_31X8",
        urls = [
            "https://www.youtube.com/watch?v=nBwHtgQH2EQ",
            "https://www.youtube.com/watch?v=l5-gja10qkw",
            "https://www.youtube.com/watch?v=M3B5U1S-I4Y",
            "https://www.youtube.com/watch?v=P027oGJy2n4",
            "https://www.youtube.com/watch?v=VoA9tLkrgHY",
        ]

export default describe('/nodes API', function() {
    
    before(function(done) {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
        // Create user, mood and nodes
        user
            .post('/api/auth/signup')
            .send({ username, password })
            .expect(200)            
            .end(result => {
                user
                    .post('/api/auth/login')
                    .send({ username, password })
                    .expect(302)
                    .end((error, res) => {
                        if (error) return done(error)
                        user
                            .post('/api/moods')
                            .send({ name: moodName })
                            .expect(200)
                            .end(error => {
                                if (error) return done(error)
                                urls.map(url=> {
                                    user
                                        .post('/api/nodes')
                                        .send({
                                            url, moodSlug: res.body.moodslug
                                        })
                                        .expect(200)
                                })
                                if (error) return done(error)                                
                                done()
                            })
                    })
            })
    })

    // clean up
    after(function() {
        User.destroy({where: { username }})
        Mood.destroy({where: { name: moodName }})
        Node.destroy({where: { url }})
    })

    it('POST node', function(done) {
        user
            .post('/api/nodes')
            .send({ moodSlug: slug, url })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){ 
                if (err) return done(err);
                res.body.url.should.be.equal(url)
                done()
            })
    })

    it('GET single node', function(done) {
        user
            .get('/api/nodes/' + slug )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.url.should.be.equal(url)
                done()
            });
    })

    it('nodes cycle properly for unlogged user', async function() {
        
        function getNextNode(moodSlug, previousNodeId = "") {
            return user
                .get(`/api/nodes/${moodSlug}/${previousNodeId}`)
                .expect(200)
                .then(res => res.body)
        }

        try {
            // logout user
            await user.get('/api/auth/logout').expect(200)

            const nodeIds = []
            const mood = await Mood.findOne()
            const initialNode = await getNextNode(mood.slug)
            
            // make 10 subsequent node requests
            let nextNodeId
            for(var x = 0; x < 10; x++) {
                const nextNode = await getNextNode(mood.slug, nextNodeId || initialNode.id)
                nextNodeId = nextNode.id
                nodeIds.push(nextNode.id)
            }
            
            // there must be no duplicate nodes fetched
            expect(
                nodeIds.length != uniq(nodeIds).length,
                'nodes in cycle are not unique'
            ).to.be.true
        } catch (error) {
            throw new Error(error)
        }
    })

    // it('nodes cycle properly for logged in user', async function(){
    //     throw new Error('implement this')
    // })

})