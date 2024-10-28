const { Router }=require("express");
const adminRouter=Router();
const { adminModel, courseModel }=require('../db')
const bcrypt=require('bcrypt');
const { z }=require('zod');
const jwt=require('jsonwebtoken');
const { adminSecretKey }=require('../config');
const { adminMiddleware }=require('../middleware/admin');

adminRouter.post('/signUp',async function(req, res){
    const requiredBody=z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(5).max(100)
    })

    const parsedDataWithSuccess=requiredBody.safeParse(req.body);

    if(!parsedDataWithSuccess){
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        })
        return;
    }

    const { email, password, firstName, lastName}=req.body;

    const hashPassword=await bcrypt.hash(password,5);
    
    try{
        await adminModel.create({
            email: email,
            password: hashPassword,
            firstName: firstName,
            lastName: lastName
        })
        res.json({
            message: "SignUp Successful"
        })
    }catch(e){
        console.error(e);
    }
})

adminRouter.post('/signIn',async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    const admin=await adminModel.findOne({
        email: email
    })

    if(!admin){
        res.status(403).json({
            message: "admin does not exists!"
        })
    }

    const passwordMatch=await bcrypt.compare(password,admin.password);
    if(passwordMatch){
        const token=jwt.sign({
            id: admin._id
        },adminSecretKey);
        res.json({
            token: token
        });
    }else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
    
})

adminRouter.post('/course',adminMiddleware, async function(req, res){
    const adminId=req.adminId;
    const {title, description, price, imageUrl}=req.body;

    try{
        await courseModel.create({
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
            creatorID: adminId
        })
        res.json({
            message: "Course Created",
            courseId: course._id
        })
    }catch(e){
        console.error(e)
    }
})

adminRouter.put('/course',function(req,res){

})

adminRouter.get('/course/bulk',function(req, res){
    res.json({
        message: "purchase endpoint"
    })
})

module.exports={
    adminRouter: adminRouter
}
