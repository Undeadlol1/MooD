import chai, { assert } from 'chai'
import request from 'supertest'
import server from '../../server.js'
import { User } from '../../data/models'
chai.should();

export default describe('/users API', function() {
    
    before(function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()
    })

    after(function() {
        server.close()
    })

    it('get one user', async function() {
        try {
            const user = await User.findOne({order: 'rand()'})
            await request(server)
                .get(`/api/users/user/${user.username}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(function(res) {
                    assert(res.body && res.body.id, 'res.body must have an id')
                    assert(res.body.username == user.username)                    
                })
        }
        catch (error) {
            console.error(error)
            throw new Error(error)
        }
    })

    // it('fails to get user if no username provided', async function() {
    //     try {
    //         await request(server)
    //             .get('/api/users/user/')
    //             .expect(404)
    //             // .then(function(res) {
    //             //     console.log('res', res.body)
    //             // })
    //     } catch (error) {
    //         console.error(error)
    //         throw new Error(error)
    //     }
    // })

})