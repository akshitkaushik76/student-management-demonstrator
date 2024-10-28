const student = require('./infoschema');
const Apifeatures = require('./apifeatures');
const { response } = require('express');
const asyncErrorHandler = require('./asyncerrorhandler');
const customError = require('./customerror');



exports.getallstudents = asyncErrorHandler(async(req,res,next)=>{
    
        const features = new Apifeatures(student.find(),req.query).filter().sort().limiting().pagination();
        let students = await features.query;
        res.status(200).json({
            message:"success",
            length:students.length,
            data:{
                students
            }
        });
    
})
exports.getstudentbyid = asyncErrorHandler(async(req,res,next)=>{
    const students = await student.findById(req.params.id);
    if(!students) {
      const error = new customError('student with id s not found',404);
      return next(error);
    }
    res.status(200).json({
    status:"success",
    data:students
   });
})
exports.poststudent = asyncErrorHandler(async(req,res,next)=>{
    const students = await student.create(req.body);
    res.status(200).json({
        status:'success',
        students,
    });
})
exports.patchstudent = asyncErrorHandler(async(req,res,next)=>{
    
        const updatestudent = await student.findByIdAndUpdate(req.params.id,req.body);
        if(!updatestudents) {
            const error = new customError('student with id s not found',404);
            return next(error);
          }
        res.status(200).json({
            status:"success",
            data:{
                updatestudent
            }
        })
   
 })
 exports.deletestudent = asyncErrorHandler(async(req,res,next)=>{
    
        studenttodelete = await student.findByIdAndDelete(req.params.id);
        if(!studenttodelete) {
            const error = new customError('student with id s not found',404);
            return next(error);
          }
        res.status(200).json({
            status:"success",
            data:null
        })
   
 })
 exports.getuserbystats = asyncErrorHandler(async(req,res)=>{
    
        const result = await student.aggregate([
            {
                $addFields:{
                    totalMarks:{
                        $sum:[
                            "$physics",
                            "$chemistry",
                            "$maths",
                            "$computer",
                            "$language"
                        ]
                    },
                    averageMarks: {
                        $avg: [
                          "$physics",
                          "$chemistry",
                          "$maths",
                          "$computer",
                          "$language"
                        ]
                      },
                    percentage:{
                        $multiply:[
                            {
                                $divide:[
                                    {
                                        $sum:[
                                           "$physics",
                                           "$chemistry",
                                           "$maths",
                                           "$computer",
                                           "$language" 
                                        ]
                                    },
                                    500
                                ]
                            },
                            100
                        ]
                    }      
                }
            }
        ]);
        res.json(result);
   
 }) ; 