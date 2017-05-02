// import 'babel-polyfill'
// import server from '../server.js'
// import './middlewares/moodsApi.test.js'

// describe('app', function(){
//   beforeEach(function(){
//     // server.listen(process.env.PORT || 3000);
//   });
//   // tests here
//   afterEach(function(){
//     // server.close();
//   })
// });

// This will search for files ending in .test.js and require them
// so that they are added to the webpack bundle
var context = require.context('.', true, /.+\.test\.js?$/);
context.keys().forEach(key => {
  console.log(key)
})
context.keys().forEach(context);
module.exports = context;