const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/auth_db', {useNewUrlParser: true});

const db = mongoose.connection

db.on('error', console.error.bind(console, 'error connecting to db'))
db.once('open', function(){
  console.log('Successfully connected to the database', db.name)
})

module.exports = db