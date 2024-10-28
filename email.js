const nodemailer = require('nodemailer');

const sendemail = async(option) =>{
//sending the email

//create a transporter to send the email eg. like gmail.not using gmail service though
//we will use mailtrap 
const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }

})
//DEFINING EMAIL OPTION//
const emailoption =   {
  from:'studentsupport<suppor@student.com>',
  to:option.email,
  subject:option.subject,
  text:option.message
}

await transporter.sendMail(emailoption);

}
module.exports = sendemail;
//this is genuinely made by akshit kaushik by learning..//