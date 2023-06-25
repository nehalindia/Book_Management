const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');
require('dotenv').config


const userVerify = async (req,res, next) => {
    try{
        const token = req.headers['x-api-key']
        if(!token) {return res.status(401).send({status:false, message: "token is requires!"})}
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            // if(err){return res.status(403).send({status:false,message:"Invalid token! author"}) }
            // else{       
                const theUser = await userModel.findOne({_id:decoded.userId})
                if(!theUser){ return res.status(401).json({status: false, msg: "author not login"})}
                req.userId = decoded.userId
                    next()
            // }
        })
    }catch(error){
        res.status(500).send({status:false, message: error.message })
    }
}


module.exports = {
    userVerify
}