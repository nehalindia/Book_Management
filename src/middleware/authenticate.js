const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const jwt = require('jsonwebtoken');
require('dotenv').config

const JWT_SECRET_KEY = "secret-key-for-login"

const userVerify = async (req,res, next) => {
    try{
        const token = req.headers["x-api-key"]
        if(!token) {return res.status(401).send({status:false, message: "token is requires!"})}
        jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
            if(err) {return res.status(403).send({status:false,message:"Invalid token!"}) }
            else{       
                if(!ObjectId.isValid(decoded.userId)) {
                    res.status(400).send({status: false, message: ` not a valid token id`})
                    return
                }
                const theUser = await userModel.findOne({_id:decoded.userId})
                
                if(!theUser){ return res.status(401).json({status: false, msg: "author not login"})}
                // console.log(req.body.userId , decoded.userId)
                // if(req.body.userId !== theUser._id){
                //     return res.status(401).send({status :false, message: "userId not matched"})
                // }
                req.userId = decoded.userId
                    next()
            }
         })
    }catch(error){
        res.status(500).send({status:false, message: error.message })
    }
}


module.exports = {userVerify}