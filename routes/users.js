const express = require('express');
const router = express.Router()
const usersController = require('../controllers/users_controller')
const passport = require('passport')

router.get('/profile/:id', passport.checkAuthentication ,usersController.profile)


router.get('/sign-in', usersController.signIn )
router.get('/sign-up', usersController.signUp )
router.post('/create', usersController.create )

router.post('/create-session',passport.authenticate('local', {failureRedirect:'/users/sign-in'}), usersController.createSession )


//scope is the info we are looking to fetch
router.get('/auth/google', passport.authenticate('google', {scope:  ['profile', 'email']}))
router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect: '/users/sign-in'}), usersController.createSession)

router.get('/sign-out', usersController.signOut)





module.exports = router