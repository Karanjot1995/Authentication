require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser')
const port = process.env.PORT;
const app = express();


const expressLayouts = require('express-ejs-layouts')
const db = require('./config/mongoose')
// //used for session cookie
const session = require('express-session')

const passport = require('passport')
const passportLocal = require('./config/passport-local-strategy')
const passportJWT = require('./config/passport-jwt-strategy')
const passportGoogle = require('./config/passport-google-oauth2-strategy')

const MongoStore = require('connect-mongo')(session)
const sassMiddleware = require('node-sass-middleware')
// const flash = require('connect-flash')
// const customMware = require('./config/middleware')


app.use(sassMiddleware({
  /* Options */
  src: './assets/scss',
  dest: './assets/css',
  debug: true,
  outputStyle: 'extended',
  prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}))

app.use(express.urlencoded());
app.use(cookieParser())

app.use(expressLayouts)
app.use(express.static('./assets'))

// //make the uploads path available to the browser at /uploads
// app.use('/uploads', express.static(__dirname + '/uploads'))


// //extract style and scripts from sub pages into the layout
app.set('layout extractStyles' , true)
app.set('layout extractScripts' , true)


// //mongo store is used to store the  session cookie in the db
app.use(session({
  name:'auth',
  //todo change the secret befor deployment
  secret: 'blahsomething',
  saveUninitialized:false,
  resave:false,
  cookie:{
    maxAge: (1000*60*100)
  },
  store: new MongoStore({
    mongooseConnection: db,
    autoRemove: 'disabled'
  }, (err)=>{
    if(err){
      console.log(err || 'connect mongodb setup ok')
    }
  })
}))


app.use(passport.initialize())

app.use(passport.session())

app.use(passport.setAuthenticatedUser)

// app.use(flash())
// app.use(customMware.setFlash)

// //use express router
app.use('/', require('./routes'))
app.set('view engine','ejs')
app.set('views', './views')

app.get('/', (req,res)=>{res.send('hii')})

app.listen(port, (err)=>{
  if(err){
    console.log(`Error in running the server: ${err}`)
  }
  console.log(`app listening on localhostlistening at http://localhost:${port}`)
})
