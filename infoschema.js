const mongoose = require('mongoose');
const studentschema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'firstname is required'],
    },
    lastname:{
        type:String,
        required:[true,'lastname is required']
    },
    rollnumber:{
        type:Number,
        required:[true,'enter the roll number of the system']
    },
    physics:{
        type:Number,
        required:[true,'enter the physics marks']
    },
    chemistry:{
        type:Number,
        required:[true,'enter the chemistry marks'],
    },
    maths:{
        type:Number,
        required:[true,'enter the maths marks']
    },
    computer:{
        type:Number,
        required:[true,'enter the computer marks']
    },
    language:{
        type:Number,
        required:[true,'enter the language marks']
    },
    
});
const student = mongoose.model('distributor',studentschema);
module.exports = student;