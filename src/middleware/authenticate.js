const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const jwt = require('jsonwebtoken');

const userVerify = async (req,res, next) => {
    try{
        const token = req.headers["x-api-key"]
        if(!token) {return res.status(401).send({status:false, message: "token is requires!"})}
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if(err) {return res.status(403).send({status:false,message:"Invalid token!"}) }
            else{       
                if(!ObjectId.isValid(decoded.userId)) {
                    res.status(400).send({status: false, message: ` not a valid token id`})
                    return
                }
                const theUser = await userModel.findOne({_id:decoded.userId})
                // console.log(decoded.userId,theUser)
                if(!theUser){ return res.status(401).json({status: false, msg: "author not login"})}
                
                req.userId = theUser._id
                    next()
            }
         })
    }catch(error){
        res.status(500).send({status:false, message: error.message })
    }
}


module.exports = {userVerify}