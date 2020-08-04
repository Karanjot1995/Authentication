const nodeMailer = require('../config/nodemailer')


//module.exports or exports
exports.newPassword  = (forgotuser) =>{
  let htmlString = nodeMailer.renderTemplate({user: forgotuser}, '/new_password.ejs')
  nodeMailer.transporter.sendMail({
    from: "karan.nanda97@gmail.com",
    to: forgotuser.user.email,
    subject: 'Password reset',
    html: htmlString
  }, (err,info)=>{
    if(err){
      console.log('Error in sending mail', err)
      return
    }
    // console.log('Mail delivered', info)
    return
  })

}