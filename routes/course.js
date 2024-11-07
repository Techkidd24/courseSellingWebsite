const { Router }=require('express');
const { courseModel, purchaseModel } = require('../db');
const { userMiddleware }=require('../middleware/user');
const courseRouter=Router();

courseRouter.get("/preview",async function(req, res){
    const courses=await courseModel.find({});
    
    res.json({
        courses
    })
})

courseRouter.post("/purchase",userMiddleware, async function(req,res){
    const userId=req.userId;
    const courseId=req.body.courseId;

    await purchaseModel.create({
        userId: userId,
        courseId: courseId
    })
    res.json({
        message: "You have successfully bought the course"
    })
})

module.exports={
    courseRouter: courseRouter
}