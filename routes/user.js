const { Router }=require('express');
const userRouter=Router();
const { userModel }=require('../db');
const { z }=require('zod');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { userSecretKey }=require('../config')
const userMiddleware=require('../middleware/user')

userRouter.post('/signIn', async function(req,res){
    const { email, password}=req.body;
    const user=await userModel.findOne({
        email: email
    })

    if(!user){
        res.status(403).json({
            message: "User does not exists!"
        })
    }

    const passwordMatch=await bcrypt.compare(password,user.password);
    if(passwordMatch){
        const token=jwt.sign({
            id: user._id
        },userSecretKey);
        res.json({
            token: token
        })
    }else{
        res.status(403).json({
            message: "incorrect credentials"
        })
    }
})

userRouter.post('/signUp',async function(req, res){
    const requiredBody=z.object({
        email: z.string().min(3).max(50).email(),
        password: z.string().min(3).max(50)
    })

    const parsedDataWithSuccess=requiredBody.safeParse(req.body);

    if(!parsedDataWithSuccess){
        res.json({
            message: "incorrect format",
            error: parsedDataWithSuccess.error
        })
        return;
    }

    const { email, password, firstName, lastName }=req.body;
    const hashPassword=bcrypt.hash(password,5);

    try{
        await userModel.create({
            email: email,
            password: hashPassword,
            firstName: firstName,
            lastName: lastName
        })
        res.json({
            message: "SignUp successful"
        })
    }catch(e){
        console.error(e)
    }

})

userRouter.get('/purchases',function(req, res){
    res.json({
        message: "purchase endpoint"
    })
})

module.exports={
    userRouter: userRouter
}