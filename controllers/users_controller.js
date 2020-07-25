const User = require('../models/user')
const bcrypt = require('bcrypt')

module.exports.profile = function(req,res){
  User.findById(req.params.id, (err,user)=>{
    return res.render('user_profile', {title:'User Profile', profile_user:user})
  })
}


module.exports.create = (req,res)=>{
  if(req.body.password != req.body.confirm_password){
    return res.redirect('back')
  }
  User.findOne({email:req.body.email}, (err,user)=>{
    if(err){
      console.log('error in finding user and signing up')
      return
    }
    //if user does not already exist then signup(create new user)
    if(!user){
      bcrypt.hash(req.body.password, 10, (err,hash)=>{
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        }, (err,user)=>{
          if(err){
            console.log('error in creating user while signing up')
            return
          }
          return res.redirect('/users/sign-in')
         })

      })

    }else{
      return res.redirect('back')
    }
  })
}

//sign in and create session for the user
module.exports.createSession = async function(req,res){
  console.log('Logged in successfully')
  // req.flash('success', 'Logged in successfully')
  return res.redirect(`/users/profile/${req.user.id}`)
  
}


module.exports.signIn = (req,res)=>{
  if(req.isAuthenticated()){
    return res.redirect(`/users/profile/${req.user.id}`)
  }
  return res.render('sign_in')
}

module.exports.signUp = (req,res)=>{
  if(req.isAuthenticated()){
    return res.redirect(`/users/profile/${req.user.id}`)
  }
  return res.render('sign_up')
}

module.exports.signOut = function(req,res){
  console.log('You have logged out')
  req.logout()
  return res.redirect('/users/sign-in')
}