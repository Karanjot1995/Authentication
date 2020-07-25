const express = require('express');
const router = express.Router()
const userController = require('../controllers/users_controller')

router.use('/users', require('./users') )
router.use('/api', require('./api'))


module.exports = router