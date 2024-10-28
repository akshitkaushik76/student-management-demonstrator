const express = require('express');

const mongoose = require('mongoose');

const customerror = require('./customerror');

const dotenv = require('dotenv');

dotenv.config({path:'./config.env'});

const studentauthrouter = require('./authrouter');

const app = express();

const studentrouter = require('./router');
const globalerrorhandler = require('./gehmid');

mongoose.connect('mongodb://localhost:27017/student_collection',{
    
}).then((conn)=>{
    console.log(conn);
    console.log("db connected successfully");
}).catch((error)=>{
    console.log("some error has occured");
})

app.use(express.json());

app.use("/api/student",studentrouter);

app.use("/api/student-signup",studentauthrouter);

app.all('*',(req,res,next)=>{
//    const err = new Error(`cant find ${req.originalUrl} in the server`);
//    err.status = 'fail';
//    err.statusCode = 404;
//    next(err);
  const err = new customerror(`cant find ${req.originalUrl} in the server`,404);
  next(err);
})

app.use(globalerrorhandler);

app.listen(8020,()=>{
    console.log("server has started");
})