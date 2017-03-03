import path from "path"
import express from "express"
import bodyParser from 'body-parser'
import session from "express-session"
import cookieParser from 'cookie-parser'
import {passport, router as authorization} from "./middlewares/auth"

const port = 3000,
      app = express()

// middlewares
app.use(express.static(path.resolve(__dirname, 'public')))
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
app.get('/test', function(req, res) {
  console.log('this must be working');
  console.log(req.user);
  res.end();
});
app.use('/auth', authorization)

app.listen(port, () => console.log(`Server apistening on port ${port}!`))