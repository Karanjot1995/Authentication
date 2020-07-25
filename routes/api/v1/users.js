const express = require('express')
const router = express.Router()
const usersApi = require('../../../controllers/api/v1/users_api')
const passport = require('passport')


router.get('/', usersApi.users)

router.post('/create-session', usersApi.createSession)
// router.delete('/:id', passport.authenticate('jwt', {session: false}) ,postsApi.delete)



module.exports = router