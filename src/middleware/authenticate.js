const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');
require('dotenv').config
const aws = require("aws-sdk")
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

aws.config.update({
    apiVersion: '2010-12-01',//'2006-03-01',
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async ( file) =>{
    return new Promise( function(resolve, reject) {
        let s3= new aws.S3(); 
 
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "nehal/" + file.originalname,
             Body: file.buffer
        }
 
        //  console.log(uploadParams)
        s3.upload( uploadParams, function (err, data ){
            if(err) {
                return reject({"error": err})
            }
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
 
    })
 }

 const awsfile = async function(req, res, next){
    try{
        let files= req.files
        // console.log(files)
        if(files && files.length>0){
            req.body.cover = await uploadFile( files[0] )
            next()
            // res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
}


const userVerify = async (req,res, next) => {
    try{
        const token = req.headers['x-api-key']
        if(!token) {return res.status(401).send({status:false, message: "token is requires!"})}
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)//, async (err, decoded) => {
        //     if(err){return res.status(403).send({status:false,message:"Invalid token! author"}) }
        //     else{       
        //         const theUser = await userModel.findOne({_id:decoded.userId})
        //         if(!theUser){ return res.status(401).json({status: false, msg: "author not login"})}
        //         req.userId = decoded.userId
        //             next()
        //     }
        // })
        req.userId = decoded.userId
        next()
    }catch(error){
        res.status(500).send({status:false, message: error.message })
    }
}


module.exports = {
    userVerify,
    awsfile
}