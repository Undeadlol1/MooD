import chai from 'chai'

chai.should();

export default describe('TEST CLIENT', function() {
    it('TEST TO STRING', function() {
        ['something'].should.be.a('string');
    })
})