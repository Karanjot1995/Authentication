const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const crypto = require('crypto')
const User = require('../models/user')

passport.use(new googleStrategy({
    clientID:"1016643530275-n8pbga5vmpkr3rcpnvcsnqb4ltjhbavh.apps.googleusercontent.com",
    clientSecret:"7BHnXm11Z3MnIF7-foC2Ffw2",
    callbackURL: "http://localhost:8800/users/auth/google/callback"
  },
  function(accessToken, refreshToken, profile,done){
    User.findOne({email: profile.emails[0].value}).exec(function(err,user){
      if(err){
        console.log('Error in google strategy passport', err)
        return
      }
      console.log(accessToken)
      console.log(refreshToken)
      console.log(profile)
      if(user){
        //if found, set the user found in the DB as the google details
        return done(null, user)
      }else{
        //ifnot found create a new user in the DB using that google details
        User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString('hex')
        }, function(err,user){
          if(err){ 
            console.log('Error in creating user', err); 
            return; 
          }
          return done(null,user)
        })
      }
    })
  }
))

module.exports =  passport
