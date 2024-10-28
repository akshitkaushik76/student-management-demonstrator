const express = require('express');
const User = require('./authusermodel');
const jwt = require('jsonwebtoken');
const asyncerrorhandler  = require('./asyncerrorhandler');
const customerror = require('./customerror');
const util = require('util');
const sendemail = require('./email');
const crypto = require('crypto');

const signtoken = (id)=>{
    return jwt.sign({id},process.env.SECRET_STRING,{
        expiresIn:process.env.LOGIN_EXPIRES
    });
}

exports.signup = asyncerrorhandler(async (req,res,next)=>{
    
        const newuser = await User.create(req.body);
        const token = signtoken(newuser._id);
    
    res.status(200).json({
        status:"success",
        token,
        data:newuser,
    })


})

//login function//
exports.login = asyncerrorhandler(async(req,res,next)=>{
    const email = req.body.email;//retrieve email
    const password = req.body.password;//retrieve password

    if(!email || !password) {//checking email and password are provided
        const error = new customerror('please provide an email and password as specified',400);
        return next(error);
    }
    const user = await User.findOne({email}).select('+password');//finding user using given email
    const ismatch = user.comparepswdinDb(password,user.password);
    if(!user || !ismatch) {
        const error = new customerror('incorrect email or password provided',400);
        return next(error);
    }

    const token = signtoken(user._id); //after all check generating jwt token

    res.status(200).json({//sending the resonse to the user
        status:'success',
        token,
    
    });
})
exports.protect = asyncerrorhandler(async(req,res,next) => {
    const testtoken = req.headers.authorization;
    let token;
    if(testtoken && testtoken.startsWith('Bearer')) {
        token  = testtoken.split(' ')[1]
    }
    if(!token) {
        next(new customerror('you are not logged in',401));
    }
    console.log(token);
     const decodedtoken = await util.promisify(jwt.verify)(token,process.env.SECRET_STRING)
     console.log(decodedtoken);
     
     //if user was deleted after he/she was logged due to which token exist but user not exist//
     const user = await User.findById(decodedtoken.id);
     if(!user) {
        const error = new customerror('the user with the given token does not exist',401);
        next(error);
     }
     const timestamp = decodedtoken.iat;
     const ischanged = await user.ispasswordChanged(timestamp);
     if(ischanged) {
        const error  = new customerror('password changed recently please login again',401);
        return next(error);
     }
   req.user = user;
     // if the user changed password after token was issued
    next()
})
exports.restrict = (role)=>{
    return (req,res,next) =>{
        if(req.user.role !== role ) {
            const error = new customerror('you do not have permission to perform this action',403);
            next(error);
        }
       next();
    }
}
exports.pswdforgot = asyncerrorhandler(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user) {
        const error = new customerror('user with the email is no+t found',404);
        next(error);
    }user.confirmpassword = undefined;
    //now to create a random reset token we will make an instance method for this in schema
    const resettoken = user.createpswdtoken();
    await user.save({validateBeforeSave:false});
    const reseturl = `${req.protocol}://${req.get('host')}/api/student-signup/resetPassword/${resettoken}`//return the ip address and the port no.req at this link
    const message = `we have recieved a password reset request . please use the below link to reset your password\n\n${reseturl}\n\nthis reset password link will be valid for 10 mins`;
     try{
        await sendemail({//we might have the rejected promise
            email:user.email,
            subject:'password change request recieved',
            message:message
        });
        res.status(200).json({
            status:'success',
            message:'pasword reset link sent to the user email'
        })
     }catch(err){
        user.pswdresettoken = undefined;
        user.pswdresettokenexpire = undefined;
        user.save({validateBeforeSave:false});
       return next(new customerror('there was an error sending pswad reset email',500));
     }
    
    // res.status(200).json({
    //     status: 'success',
    //     message: 'Token generated successfully',
    //     token: resettoken
    // });
})
exports.resetPassword = asyncerrorhandler(async(req,res,next)=>{
    //select the user based on the password reset token
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')//encrypting password reset token
    const user = await User.findOne({pswdresettoken:token,pswdresettokenexpire:{$gt:Date.now()}});

    //in the database password reset token is encrypted but we are using plane password here.
    //we also want to check the password reset token is expired or not
    //if the user doesnt exist//
    if(!user) {
        const error = new customerror('token is invalid or has expired',400);
        next(error);
    }
    user.password = req.body.password;
    
    user.confirmpassword = req.body.confirmpassword;
    
    //after setting new password we are gonna set the following fields to undefined//
    user.pswdresettoken = undefined;
    user.pswdresettokenexpire = undefined;
    user.passwordchangedAt=Date.now();
    user.save();//we want the validation to happen
    //once the password is reset we also want the user to logni automatically//

     const logintoken = signtoken(user._id); //after all check generating jwt token

    res.status(200).json({//sending the resonse to the user
        status:'success',
        token:logintoken
    
    });

})
//updating the password whenever the user is logged in
exports.updatepassword = asyncerrorhandler(async(req,res,next)=>{
    //user should pass his/her current password//
    //so how would we find the user by id, simply by calling the protect method first because we are setting user there at the end//

   const user = await User.findById(req.user._id).select('+password')//in the result we would not get the password so we call it explicitly//
   

    //get current user data from db//
    //using comparepswdindb instance method here//
    if(!(await user.comparepswdinDb(req.body.currentpswd,user.password))){
        return next(new customerror('password provided is wrong',401));
    } 
    //the user password is encrypted but the current bod password which is provided woukd not be encrypted//
    //check if the supplied password is correct//
    user.password = req.body.password;
    user.confirmpassword = req.body.confirmpassword;
    await user.save();

    //login user and send jwt//
    const token = signtoken(user._id);
    res.status(200).json({
        status:'success',
        token,
        data:{
            user
        }
    })

})

