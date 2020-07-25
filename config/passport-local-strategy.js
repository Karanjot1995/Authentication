const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
const bcrypt = require('bcrypt')


//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },
  function(req,email,password,done){
    User.findOne({email: email}, function(err,user){
      if(err){
        console.log("error", err)
        // req.flash('error', err)
        return done(err)
      }
      // if(!user || user.password!= password){
      //   console.log("error in authentication")
      //   // req.flash('error', 'Invalid Username/Password')
      //   return done(null, false)
      // }
      if(bcrypt.compareSync(password, user.password)){
        return done(null,user)
      }
      return done(null, false)
    })
  }
))

//serialize the user to decide which key is to be kept in the cookies
passport.serializeUser((user,done)=>{
  done(null, user.id)
})

//deserializing the user from the key in the cookies
passport.deserializeUser((id,done)=>{
  User.findById(id, function(err,user){
    if(err){
      console.log('error in finding user --> Passport')
    }
    return done(null,user)
  })
})

passport.checkAuthentication = function(req,res,next){
  //if the user is  signed in then pass on the request to the next function(the controller's action)
  if(req.isAuthenticated()){
    return next();
  }

  //if the user is not signed in
  return  res.redirect('/users/sign-in')
}

passport.setAuthenticatedUser = (req,res,next)=>{
  if(req.isAuthenticated()){
    //req.user contains the current signed in user in the session cookie and we are sending it to the locals for the views
    res.locals.user = req.user
  }
  next()
}


module.exports = passport
