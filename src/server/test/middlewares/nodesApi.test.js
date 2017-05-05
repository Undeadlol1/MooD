import 'babel-polyfill'
import chai from 'chai'
import request from 'supertest'
import server from '../../server'
import { Mood, User, Node } from '../../data/models'
import slugify from 'slug'
chai.should();

const   user = request.agent(server),
        username = "somename",
        password = "somepassword",
        moodName = "random name",
        slug = slugify(moodName),
        url = "https://www.youtube.com/watch?v=l5-gja10qkw" 

export default describe('/nodes API', function() {
    
    before(function(done) {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
        // Create user and create mood
        user
            .post('/api/auth/signup')
            .send({ username, password })
            .expect(200)            
            .end(result => {
                user
                    .post('/api/auth/login')
                    .send({ username, password })
                    .expect(302)
                    .end(error => {
                        if (error) return done(error)
                        user
                            .post('/api/moods')
                            .send({ name: moodName })
                            .expect(200)
                            .end(error => {
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

    it('GET node', function(done) {
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

})