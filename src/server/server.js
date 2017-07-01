// this prevents babel to parse css as javascript
import csshook from 'css-modules-require-hook/preset'
import path from 'path'
import express from 'express'
import boom from 'express-boom' // "boom" library for express responses
import compression from 'compression'
import bodyParser from 'body-parser'
import session from 'express-session'
import errorhandler from 'errorhandler'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import moodsApi from './middlewares/moodsApi'
import nodesApi from './middlewares/nodesApi'
import usersApi from './middlewares/usersApi'
import decisionsApi from './middlewares/decisionsApi'
import externalsApi from './middlewares/externalsApi'
import { mustLogin } from './services/permissions'
import authApi, { passport } from './middlewares/authApi'
import 'source-map-support/register' // do we actually need this?
import morgan from 'morgan'
import helmet from 'helmet'
import createLocaleMiddleware from 'express-locale';
import RateLimiter from 'express-rate-limit'
const RedisStore = require('connect-redis')(session)
var cache = require('express-redis-cache')();

// TODO add server side bundle minification to improve perfomance

const port = process.env.PORT || 3000,
      app = express(),
      publicUrl = path.resolve('./dist', 'public'), // TODO: or use server/public?
      cookieExpires = 100 * 60 * 24 * 100 // 100 days

const limiter = new RateLimiter({
  windowMs: 15*60*1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 200 // disable delaying - full speed until the max limit is reached
});

// development only middlewares
if (process.env.NODE_ENV === 'development') { // TODO create dev middleware whic applues all dev specific middlewares
  app.use(errorhandler())
  app.use(morgan('dev')) // logger
  // enable 'access control' to avoid CORS errors in browsersync
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
}

// some routes return 304 if
// multiple calls to same route are made
// (while validating user info in signup form, for example)
app.disable('etag');

// middlewares
// detect accepted languages for i18n
app.use(createLocaleMiddleware())
app.use(compression())
app.use(express.static(publicUrl))
app.use(cookieParser())
app.set('query parser', 'simple');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
  name: 'session',
  store: new RedisStore(),
  keys: [process.env.SESSION_KEY || 'keyboard cat'],
  maxAge: 24 * 60 * 60 * 1000 * 30 // 1 month // TODO this is the reason of reauth
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(boom()) // provides res.boom. erros dispatching
app.use(helmet()) // security

if (process.env.NODE_ENV === 'production') {
  // rate limiter
  // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
  // app.enable('trust proxy');
  app.use(limiter)
}

// REST API
app.use('/api/auth', authApi)
app.use('/api/users', usersApi)
app.use('/api/moods', moodsApi)
app.use('/api/nodes', nodesApi)
app.use('/api/decisions', decisionsApi)
app.use('/api/externals', externalsApi)

/* SEND HTML FOR SPA */
// set handlebars as templating engine
import exphbs from 'express-handlebars'
const { engine } = exphbs.create({});
app.engine('handlebars', engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './public'));

import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import match from 'react-router/lib/match'
import { Helmet } from 'react-helmet'
import routes from 'browser/routes'
import serialize from 'serialize-javascript'
import { Provider } from 'react-redux'
import store from 'browser/redux/store'
import 'isomorphic-fetch' // fetch polyfill

// TODO move this to middleware
// all routes are processed client side via react-router
app.get('/*',
  function (req, res, next) {
    cache.get(function (error, entries) {
      if ( error ) throw error

      entries.forEach(console.log.bind(console));
    })
    next()
  },
  // TODO setup caching for logged in and unlogged
  // TODO setup caching for /mood/something
  // middleware to define cache prefix
  function (req, res, next) {
    // set cache name
    res.express_redis_cache_name = 'url-' + req.url
    next();
  },

  // cache middleware
  cache.route(),
  // markup renderer
  function(req, res) {
    match(
        {routes, location: req.url},
        (error, redirectLocation, renderProps) => {
          if (error) res.status(500).send(error.message)

          else if (redirectLocation) {
            const location =  redirectLocation.pathname
                              + redirectLocation.search
            res.redirect(302, location)
          }
          // render website content
          else if (renderProps) {
            const sheet = new ServerStyleSheet()
            /*
              sometimes request language and browser language are not the same
              so we use browsers language (storred in cookie) as primary preference
            */
            const cookieLocale = req.cookies.locale
            const requestLocale = req.locale.language
            const language = cookieLocale || requestLocale
            global.navigator = global.navigator || {language};
            /*
              supply userAgent for material ui prefixer in ssr
              http://stackoverflow.com/a/38100609
            */
            global.navigator.userAgent = req.headers['user-agent'] || 'all';
            // require App after userAgent is set
            const App = require('browser/App').default
            // render App to string
            const markup = renderToString(
              <StyleSheetManager sheet={sheet.instance}>
                <App {...renderProps}/>
              </StyleSheetManager>
            )
            // extract css from string
            const css = sheet.getStyleTags()
            // extract metaData for <header>
            let headerTags = []
            const metaData = Helmet.renderStatic()
            for (var prop in metaData) {
              const tag = metaData[prop].toString()
              tag && headerTags.push(tag)
            }
            // get prefetched data from redux
            // TODO make sure to reset state afterwards
            const initialData = JSON.stringify(store.getState())//.replace(/</g, '\\u003c')
            // send data to handlebars template
            res.render('index', { markup, css, headerTags, initialData })
          }

          else res.status(404).send('Not found')
    } );
})

// export app to use in test suits
export default app.listen(port, () => {
    if (process.env.NODE_ENV != 'test') {
      console.info(`Environment is: ${process.env.NODE_ENV}!`)
      console.info(`Server listening on port ${port}!`)
    }
})