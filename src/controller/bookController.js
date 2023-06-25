const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const validator = require('validator');
const {isValid,isValidRequestBody} = require('../validation/validator');
const userModel = require('../models/userModel');

const createBook = async (req,res) => {
    try{
        let data = req.body
        if(!isValidRequestBody(data)){
            return res.status(400).send({status :false, message: "Must add data"})
        }
        if(!isValid(data.title)){
            return res.status(400).send({status :false, message: "Must add title"})
        }
        const existingUser = await bookModel.findOne({ title: data.title,isDeleted:false });
        if(existingUser) {
                return res.status(400).send({status: false, message:  'Book title already exists'});
        }

        if(!isValid(data.excerpt)){
            return res.status(400).send({status :false, message: "Must add excerpt"})
        }

        if(!isValid(data.userId)){
            return res.status(400).send({status :false, message: "Must add userId"})
        }
        if(!ObjectId.isValid(data.userId)){
            return res.status(400).send({status: false, message:  'Not a valid Id format'});
        }
        const userexist = await userModel.findById(data.userId)
        if(!userexist){
            return res.status(400).send({status :false, message: "userId not matched"})
        }

        if(!isValid(data.ISBN)){
            return res.status(400).send({status :false, message: "Must add isbn number"})
        }
        if (!validator.isISBN(data.ISBN)) {
            return res.status(400).send({ status: false, message: " not a valid ISBN" }); 
        }
        // if(data.ISBN.length < 13 ){
        //     return res.status(400).send({status:false, message:" Not a valid ISBN"})
        // }
        const exist = await bookModel.findOne({ ISBN: data.ISBN,isDeleted:false });
        if(exist) { 
            return res.status(400).send({status: false, message:  'Book ISBN already exists'});
        }

        if(!isValid(data.category)){
            return res.status(400).send({status: false, message:  'Category must add'});
        }
        if(!isValid(data.subcategory)){
            return res.status(400).send({status: false, message:  'subCategory must add'});
        }
        if(!isValid(data.releasedAt)){
            return res.status(400).send({status: false, message:  'must add release date'});
        }
        if(!validator.isDate(data.releasedAt)){
            return res.status(400).send({status: false, message:  'Add date in proper format'});
        }
        // date format validation

        let book = await bookModel.create(data)
        let resbook = {_id:book._id, title:book.title, excerpt:book.excerpt, userId:book.userId, ISBN:book.ISBN,
        category:book.category, subcategory:book.subcategory,isDeleted:book.isDeleted, reviews:book.reviews,releasedAt:
        book.releasedAt,createdAt:book.createdAt, updatedAt:book.updatedAt}
        return res.status(201).send({status: true, data: resbook})
    }catch(error){
        res.status(500).send({status: false, message:  error.message})
    }
}

const getBook = async (req,res) => {
    try{
        let filters = {};
        if(isValidRequestBody(req.query)){
        const {userId, category, subcategory} = req.query

        if(isValid(userId) && ObjectId.isValid(userId)){
            filters["userId"] = userId
        }
        if(isValid(category)){
            filters["category"] = category.trim()
        }
        if(isValid(subcategory)){
            filters["subcategory"] = subcategory.trim()
        }

        }
        filters["isDeleted"] = false
        // console.log(filters)
        let book = await bookModel.find(filters).sort({title:1}).select({_id:1, title:1, excerpt:1, userId:1,category:1,
        reviews:1,releasedAt:1})
        if(!book){
            return res.status(404).send({status :false, message: 'no book found'})
        }
        return res.status(200).send({status:true, message: 'Book List', data : book})

    }catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

const getBookbyId = async (req,res) => {
    try{
        let id = req.params.bookId
        if(!ObjectId.isValid(id)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        let book = await bookModel.findById(id).select({__v:0,deletedAt:0})
        if(!book || book.isDeleted==true){
            return res.status(404).send({status :false, message: 'no book found'})
        }
        let review = await reviewModel.find({bookId:id, isDeleted:false}).select({_id:1, bookId:1, reviewedBy:1, reviewedAt:1,
        rating:1, review:1})
        
        // const newData = {_id:book._id, title:book.title, excerpt:book.excerpt, userId:book.userId, 
        //     category:book.category,
        // subcategory:book.subcategory, isDeleted:book.isDeleted, reviews:book.reviews,releasedAt:book.releasedAt,
        // createdAt:book.createdAt, updatedAt:book.updatedAt, reviewsData:review}
        const newData = book.toObject()
        newData["reviewsData"] = review

        return res.status(200).send({status:true, message: 'Book List', data : newData})

    }catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

const updateBook = async (req,res) => {
    try{
        let id = req.params.bookId

        if(!ObjectId.isValid(id)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        if(!ObjectId.isValid(req.userId)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        let book = await bookModel.findById(id)
        if(!book || book.isDeleted==true){
            return res.status(404).send({status :false, message: 'no book found'})
        }
        console.log(book.userId.toString(),req.userId)
        if(book.userId.toString()!==req.userId){
            return res.status(403).send({status :false, message: "userId not matched"})
        }

        let data = req.body
        if(!isValidRequestBody(data)){
            return res.status(400).send({status :false, message: "Must add data"})
        }
        for(let key in data){
            if(key=='title'|| key =='excerpt'||key=='releasedAt'||key=='ISBN'){ }
            else return res.status(400).send({status: false, message:'You can not update extra field'});
        }
        if(data.title){
            let book = await bookModel.findOne({title:data.title})
            if(book){
                return res.status(400).send({status :false, message: 'tittle already exist'})
            }
        }
        
        if(data.ISBN){
            if (!validator.isISBN(data.ISBN)) {
                return res.status(400).send({ status: false, message: " not a valid ISBN" }); 
            }
            let book = await bookModel.findOne({ISBN:data.ISBN})
            if(book){
                return res.status(400).send({status :false, message: 'ISBN already exist'})
            }
        }
       

        const save = await bookModel.findOneAndUpdate(
            { _id:id },
            data,
            { new :true }
        );
        res.status(200).send({status:true, message: "update successfully", data: save})
        
    }catch(error){
        res.status(500).send({status:false, message: error.message})
    }
}

const deleteBook = async function(req,res){
    try{
        let id = req.params.bookId
        if(!ObjectId.isValid(id)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        if(!ObjectId.isValid(req.userId)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        let book = await bookModel.findById(id)
        if(!book){
            return res.status(404).send({status :false, message: 'no book found '})
        }
        if(book.isDeleted==true){
            return res.status(404).send({status :false, message: 'book already deleted'})
        }
        // console.log(book.userId.toString(),req.userId)
        if(book.userId.toString()!==req.userId){
            return res.status(403).send({status :false, message: "userId not matched"})
        }
        
        const dateUp = {deletedAt : new Date(), isDeleted :true}
        await bookModel.updateOne({_id:id}, {$set : dateUp})
        res.status(200).send({status:true, message:"book deleted"})

    }catch(error){
        res.status(500).send({status:false, message: error.message})
    }
}

module.exports ={
    createBook,
    getBook,
    getBookbyId,
    updateBook,
    deleteBook
}