import 'babel-polyfill'
import chai from 'chai'
import request from 'supertest'
import server from '../../server.js'

chai.should();

export default describe('/moods API CRUD', function() {
    it('should GET moods', function() {
        request(server)
            .get('/api/moods')
            .expect('Content-Type', /json/)
            .expect('Content-Length', '15')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
            });
    })

    it('should GET single mood', function() {

    })

    it('should POST mood', function(done) {
        request(server)
            .post('/api/moods')
            .expect('Content-Type', /json/)
            .expect('Content-Length', '15')
            .expect(200, done)
            // .end(function(err, res) {
            //     if (err) throw err;
            // });
    })

    it('should fail to POST if not authorized', function() { // TODO move this to previous function?

    })

    it('should GET /search moods', function() {

    })
})