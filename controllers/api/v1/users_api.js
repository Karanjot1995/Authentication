const User = require('../../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


module.exports.users = async (req,res)=>{
  let users = await User.find({}).select("-password")
      
  return  res.json(200, {
    message: "list of Users",
    users: users
  })
}


module.exports.createSession = async function(req,res){
  console.log(req.body)
  try {
    let user = await User.findOne({email:req.body.email})

    if(bcrypt.compareSync(req.body.password, user.password)){
      return res.json(200,{
        message: "Sign in successful, here is your token please keep it safe",
        data: {
          token : jwt.sign(user.toJSON(), 'Auth', {expiresIn: '100000'})
        }
      })
    }
    if(!user || user.password != req.body.password){
      res.json(422, {
        message: "Invalid username/password"
      })
    }
  } catch (error) {
    console.log('********',err)
    return res.json(500, {
      message: "Internal Server Error"
    })
  }

}