const jwt=require('jsonwebtoken');
const { adminSecretKey }=require('../config');

function adminMiddleware(req, res, next){
    const token=req.headers.token;
    const decoded=jwt.verify(token, adminSecretKey);

    if(decoded){
        req.adminId=decoded.id;
        next();
    }else{
        res.status(403).json({
            message: "invalid token"
        })
    }
}

module.exports={
    adminMiddleware: adminMiddleware
}