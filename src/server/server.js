import path from "path"
import express from "express"
import bodyParser from 'body-parser'
import session from "express-session"
import cookieParser from 'cookie-parser'
import {passport, router as authorization} from "./middlewares/auth"

const port = 3000,
      app = express(),
      publicUrl = path.resolve(__dirname, 'public')

// middlewares
app.use(express.static(publicUrl))
app.use(express.static(path.resolve(__dirname, '../../dist')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'keyboard cat', // TODO: this
}))
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/auth', authorization)
app.get('/*', function(req, res) {
  res.sendFile(publicUrl + '/index.html');
});

app.listen(port, () => console.log(`Server apistening on port ${port}!`))