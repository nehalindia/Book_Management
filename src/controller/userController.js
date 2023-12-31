const userModel = require('../models/userModel')
const validator = require('validator');
const {isValid,isValidRequestBody} = require('../validation/validator')
const jwt = require('jsonwebtoken');
require('dotenv').config

const createUser = async (req,res) => {
    try{
        let data = req.body
        if(!isValidRequestBody(data)){
            return res.status(400).send({status :false, message: "Must add data"})
        }
        if(!isValid(data.title)){
            return res.status(400).send({status :false, message: "Must add title"})
        }
        if (!['Mr', 'Mrs', 'Miss'].includes(data.title)) {
            return res.status(400).json({status: false, message:  'Invalid title. User title will only include - Mr, Mrs, Miss' });
        }
        if(!isValid(data.name)){
            return res.status(400).send({status :false, message: "Must add name"})
        }
        if(!isValid(data.email)){
            return res.status(400).send({status :false, message: "Must add email"})
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
            return res.status(400).send({status: false, message:  `${data.email} Email should be a valid email address`})
        }
        const existingUser = await userModel.findOne({ email: data.email });
        if(existingUser) {
                return res.status(400).send({status: false, message:  `${data.email} Email already exists`});
        }
        if(!isValid(data.phone)){
            return res.status(400).send({status :false, message: "Must add mobile number"})
        }
        if(data.phone.length !== 10 ){
            return res.status(400).send({status :false, message: "Must add valid mobile number"})
        }
        if(!validator.isMobilePhone(data.phone)) {
            return res.status(400).send({ status: false, message: `${data.phone} plz give a correct number` }); 
        }
        const existingmobile = await userModel.findOne({ phone: data.phone });
        if(existingmobile) {
            return res.status(400).send({status: false, message:  `${data.phone} Mobile already exists`});
        }
        if(!isValid(data.password)){
            return res.status(400).send({status: false, message: 'Must add password'})
        }
        if(data.password.length < 8){
            return res.status(400).send({status:false, message:" password length must be between 8 to 15"})
        }
        if(data.password.length > 15){
            return res.status(400).send({status:false, message:" password length must be between 8 to 15"})
        }
        
        let user = await userModel.create(data)
        let response ={_id:user._id, title:user.title, name:user.name, phone:user.phone, email:user.email, password:user.password,
        address : user.address, createdAt:user.createdAt, updatedAt:user.updatedAt}
        return res.status(201).send({status: true,data: response})
    }catch(error){
        res.status(500).json({status: false, message:error.message})
    }
}

const login = async (req,res)=>{
    try {
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status :false, message: "Must add data"})
        }
        if(!isValid(req.body.email)){
            return res.status(400).send({status :false, message: "Must add email"})
        }
        if(!isValid(req.body.password)){
            return res.status(400).send({status: false, message: 'Must add password'})
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(req.body.email)) {
            return res.status(400).send({status: false, message:  'Email should be a valid email address'})
        }
        if (!req.body.password) {
            return res.status(400).send({status: false, message:  'Password must added'})
        }
        const user = await userModel.findOne({email:req.body.email});
        if(!user) return res.status(401).send({status:false, message: "invalid user!"});
        if(user.password !== req.body.password){
            return res.status(401).send({status: false,message:'ivalid user password'})
        }
        // console.log(user)
        const token = jwt.sign({
            userId:user._id,
            iat : Math.floor(Date.now() / 1000),
            exp : Math.floor(Date.now() / 1000) + 60 * 60 * 60
            }, 
            process.env.JWT_SECRET_KEY 
        )
        res.status(200).send({status:true, message:"User login sucessful", data:token})
    }catch(error){
        res.status(500).send({status: false, message:  error.message})
    }
}


module.exports = {
    createUser,
    login
}