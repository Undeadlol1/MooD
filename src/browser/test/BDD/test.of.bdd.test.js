var Nightmare = require('nightmare');
var expect = require('chai').expect; // jshint ignore:line
var config = require('config')

// TODO make this work.
// 1) fire up the server on testing start

// describe('test duckduckgo search results', function() {
//   it('should find the nightmare github link first', async function() {
//     var nightmare = Nightmare()
//     return await nightmare
//       .goto(config.URL)
//       .click('#MoodsList__item')
//       .end()
//       .then(result => console.log(result))
//   });
// });