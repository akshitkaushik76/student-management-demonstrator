const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');
const validator  = require('validator');
const crypto  = require('crypto');

const userschema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'please enter your firstname']
    },
    lastname:{
        type:String,
        required:[true,'please enter your lastname']
    },
    email:{
        type:String,
        required:[true,'enter your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'enter a valid email']
    },
    password:{
        type:String,
        required:[true,'enter the password'],
        minlength:8,
        select: false
    },
    role:{
         type:String,
         enum:['user','admin'],
         default:'user'
    },
    pswdresettoken:String,
    pswdresettokenexpire:Date,
    confirmpassword:{
        type:String,
        required:[true,'enter the password set to confirm'],
        minlength:8,
        validate:{
            validator:function(val) {
                return val == this.password;
            },
            message:'password and confirm password does not match'
        }
    },
    passwordchangedAt:Date

  
})
userschema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmpassword = undefined;
})
userschema.methods.comparepswdinDb = async function(pswd,pswdDb) {
    return await bcrypt.compare(pswd,pswdDb);
}
userschema.methods.ispasswordChanged = async function(jwtTimestamp) {
    if(this.passwordchangedAt) {
        const pswdchangetimestamp = parseInt(this.passwordchangedAt.getTime()/1000,10);
        console.log(this.passwordchangedAt,jwtTimestamp);
        return jwtTimestamp<pswdchangetimestamp
    }
    return false;
}
userschema.methods.createpswdtoken = function(){
    const resetoken = crypto.randomBytes(32).toString('hex');
    this.pswdresettoken = crypto.createHash('sha256').update(resetoken).digest('hex');
    this.pswdresettokenexpire = Date.now()+10*60*1000;
    console.log(this.pswdresettoken);
    console.log(this.pswdresettokenexpire)
    return resetoken;
}
const User = mongoose.model('User',userschema);
module.exports = User;