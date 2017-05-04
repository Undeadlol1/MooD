import chai from 'chai'
import request from 'supertest'
import server from '../../server.js'
import { User } from '../../data/models'

chai.should();

//  ALL OF THIS IS UNFINISHED WORK

export default describe('Authethication tests', function() {

    after(function() {
        User.destroy({where: {}})
    })

    const user = request.agent(server)    
    
    // var user = request.agent();
    // user
    // .post('http://localhost:4000/api/auth/vk')
    // .send({ user: 'hunter@hunterloftis.com', password: 'password' })
    // .end(function(err, res) {
    //     // user1 will manage its own cookies
    //     // res.redirects contains an Array of redirects
    // });
    
    it('login through vk', function(done) {
        user
            .get('/auth/vkontakte')
            .expect(200)
            .expect('Location', '/')
            .end(function(err, res){
                if (err) return done(err);
                console.log(res.body);
                console.log('location', res.location)
                done()
            })
    })

    it('login through twitter', function(done) {
        user
            .get('/auth/twitter')
            .expect(200)
            .expect('Location', '/')
            .end(function(err, res){
                if (err) return done(err);
                console.log(res.body);
                console.log('location', res.location)
                done()
            })
    })

    it('GET logged in user', function(done) {
        user
            .get('/auth/current_user')
            .expect(200) 
            .end(function(err, res){
                if (err) return done(err);
                res.body.should.not.be.empty()
                res.body.should.have.property('id')
                res.body.id.should.be.defined()
                console.log(res.body);
                done()
            })
    })

    

    // it('login through twitter', function(done) {
        // request(server)
        //     .get('/api/moods')
        //     .expect('Content-Type', /json/)
        //     .expect(200)
        //     .end(function(err, res) {
        //         if (err) throw err;
        //     });
    // })

    // it('logout user', function() { // TODO move this to previous function?

    // })

})