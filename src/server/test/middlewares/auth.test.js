import chai, { assert } from 'chai'
import request from 'supertest'
import server from '../../server.js'
import { User } from '../../data/models'
chai.should();

const   username = 'somename',
        password = 'somepassword'

export default describe('Authethication tests', function() {
    const user = request.agent(server)
    
    function loginUser() {
        return user
            .post('/api/auth/login')
            .send({ username, password })
            .expect(302)
            .then(result => result)
    }    
    
    before(function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    after(function() {
        server.close()
        User.destroy({where: { username }})
    })

    it('create user', function() {
        return user
                .post('/api/auth/signup')
                .send({ username, password })
                .expect(302)
    })
    // TODO write vk and twitter auth tests
    // TODO test if username exists already
    // TODO test if password is incorrect

    it('login user', function() {
        return loginUser()
    })

    it('get logged in user', async function() {
        try {
            await user
                .get('/api/auth/current_user')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(function(res) {
                    assert(res.body && res.body.id, 'res.body must have an id')
                })
        }
        catch (error) {
            console.error(error)
            throw new Error(error)
        }
    })

    it('logout user', function(done) { // TODO move this to previous function?
        loginUser()
        // TODO test logout more properly
        user
            .get('/api/auth/logout')
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            })
    })

})