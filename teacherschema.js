const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const teacherschema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'please enter your first name'],
    },
    lastname:{
        type:String,
        required:[true,'please enter the last name']
    },
    registration_no:{
        type:Number,
        required:[true,'please enter the registration no.']
    },
    phone_no:{
        type:Number,
        required:[true,'please enter your phone no.']
    },
    subject_name:{
        type:Number,
        required:[true,'please provide the field of interest']
    },
    password:{
       type:Number,
       required:[true,'please set a password']
    },
    confirmpassword:{
        type:Number,
        required:[true,'please confirm password provided']
    },
    email:{
        type:String,
        required:[true,'provide an email']
    }
});
const teacher = mongoose.model('teacher',teacherschema);
module.exports = teacher;
