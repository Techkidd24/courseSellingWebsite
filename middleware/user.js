const jwt=require('jsonwebtoken');
const { userSecretKey }=require('../config');

function userMiddleware(req, res, next){
    const token=req.headers.token;
    const decoded=jwt.verify(token,userSecretKey);

    if(decoded){
        req.userId=decoded.id;
        next();
    }else{
        res.status(403).json({
            message: "Invalid token"
        })
    }
}

module.exports={
    userMiddleware: userMiddleware
}