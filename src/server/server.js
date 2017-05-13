// this prevents babel to parse css as javascript
import csshook from 'css-modules-require-hook/preset'
import path from 'path'
import express from 'express'
import boom from 'express-boom' // "boom" library for express responses
import bodyParser from 'body-parser'
import session from 'express-session'
import errorhandler from 'errorhandler'
import expressDebug from 'express-debug'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import moodsApi from './middlewares/moodsApi'
import nodesApi from './middlewares/nodesApi'
import decisionsApi from './middlewares/decisionsApi'
import { mustLogin } from './services/permissions'
import authorization, { passport } from './middlewares/authApi'
import 'source-map-support/register' // do we actually need this?
import morgan from 'morgan'
import { buildSchema } from 'graphql'
import graphqlHTTP from 'express-graphql'
import { graphqlExpress } from 'graphql-server-express';
import schema from './graphql/schema'
import App from '../browser/app.jsx'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routesConfig from '../browser/routes'

// load production values to process.env
require('dotenv').config()

const port = process.env.PORT || 3000,
      app = express(),
      publicUrl = path.resolve('./dist', 'public'), // TODO: or use server/public?
      cookieExpires = 100 * 60 * 24 * 100 // 100 days

// development only middlewares
if (process.env.NODE_ENV === 'development') { // TODO create dev middleware whic applues all dev specific middlewares
  app.use(errorhandler())
  expressDebug(app) // TODO add comments
}

// middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev')) // logger
app.use(express.static(publicUrl))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(session({
//   // resave: true,
//   // saveUninitialized: true,
//   secret: 'keyboard cat', // TODO: this
//   // cookie:{maxAge : cookieExpires} // ?????
// })) // ???
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY || 'keyboard cat'], // [/* secret keys */],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(boom()) // provides res.boom. erros dispatching

// REST API
app.use('/api/auth', authorization)
app.use('/api/moods', moodsApi)
app.use('/api/nodes', nodesApi)
app.use('/api/decisions', decisionsApi)

// GRAPHQL
app.use('/graphql', graphqlExpress({ schema }));
// Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var rootValue = {
//   hello: () => {
//     return 'Hello world!';
//   },
// };

// app.use('/graphql', graphqlHTTP({
//   schema,
//   rootValue, // TODO implement this // or not? read the docs
//   graphiql: true,
//   formatError: error => ({
//     message: error.message,
//     locations: error.locations,
//     stack: error.stack
//   })
// }));

// SEND HTML FOR SPA
var exphbs  = require('express-handlebars');
var hbs = exphbs.create({ /* config */ });
app.engine('handlebars',  hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './public'));

app.get('/*', function(req, res) {
  console.log('BROWSER', process.env.BROWSER)
  console.log('isBrowser', process.env.isBrowser)
  match(
      {routes: routesConfig, location: req.url},
      (error, redirectLocation, renderProps) => {
        if (error) {
          res.status(500).send(error.message)
        } else if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname +
            redirectLocation.search)
        } else if (renderProps) {
          const markup = renderToString(<App {...renderProps} />);
          res.render('index', {markup});
        } else {
          res.status(404).send('Not found')
        }
  } );
})

// export app to use in test suits
export default app.listen(port, () => {
    console.info(`Environment is: ${process.env.NODE_ENV}!`)
    console.info(`Server listening on port ${port}!`)
})