const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const addReview = async function(req,res){
    try{
        let data = req.body
        let id = req.params.bookId
        if(!ObjectId.isValid(id)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        let book = await bookModel.findById(id)
        if(!book || book.isDeleted==true){
            return res.status(404).send({status :false, message: 'no book found'})
        }
        if(!data.reviewedBy){
            return res.status(400).send({status: false, message:  'Must add Name'});
        }  
        // if(!data.reviewedAt){
        //     return res.status(400).send({status: false, message:  'Must add date'});
        // }  
        if(!data.rating){
            return res.status(400).send({status: false, message:  'Must add rating'});
        }
        if(data.rating < 1 || data.rating > 5){
            return res.status(400).send({status: false, message:  'Must add proper rating'});
        }
        data.bookId= id
        data.reviewedAt = new Date()
        let save = await reviewModel.create(data)
        await bookModel.updateOne({_id:id}, {$inc: {reviews:1}})
        book = await bookModel.findById(id).select({deletedAt:0})

        let newData = {reviews:book.reviews, isDeleted:book.isDeleted, _id:book._id, title:book.title,
        excerpt:book.excerpt, userId:book.userId, ISBN:book.ISBN, category:book.category,
        subcategory:book.subcategory, releasedAt:book.releasedAt,createdAt:book.createdAt,
        updatedAt:book.updatedAt,__v:book.__v, reviewsData: save}

        res.status(200).send({status:true, message:"Review added successfully", data: newData})
    }catch(error){
        res.status(500).send({status:false, message: error.message})
    }
}
const updateReview = async function(req,res){
    try{
        let bid = req.params.bookId
        let rid = req.params.reviewId
        if(!ObjectId.isValid(bid)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        let book = await bookModel.findById(bid)
        if(!book || book.isDeleted==true){
            return res.status(404).send({status :false, message: 'no book found'})
        }
        if(!ObjectId.isValid(rid)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        let review = await reviewModel.findById(rid)
        if(!review || review.isDeleted==true){
            return res.status(404).send({status :false, message: 'no review found'})
        }
        let data = req.body
        for(let key in data){
            if(key!='review'|| key!='rating'||key!='reviewedBy'){
                return res.status(400).send({status: false, message:'You can not update extra field'});
            }
        }

        const save = await reviewModel.findOneAndUpdate(
            { _id:rid }, data, { new :true }
        );
        let review1 = await reviewModel.find({bookId:id}).select({_id:1, bookId:1, reviewedBy:1, reviewedAt:1,
            rating:1, review:1})

        const newData = {_id:book._id, title:book.title, excerpt:book.excerpt, userId:book.userId, 
            category:book.category,
        subcategory:book.subcategory, isDeleted:book.isDeleted, reviews:book.reviews,releasedAt:book.releasedAt,
        createdAt:book.createdAt, updatedAt:book.updatedAt, reviewsData:review1}

        return res.status(200).send({status:true, message: 'Book List', data : newData})
        
    }catch(error){
        res.status(500).send({status:false, message: error.message})
    }
}
const deleteReview = async function(req,res){
    try{
        let bid = req.params.bookId
        let rid = req.params.reviewId
        if(!ObjectId.isValid(bid)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        let book = await bookModel.findById(bid)
        if(!book || book.isDeleted==true){
            return res.status(404).send({status :false, message: 'no book found'})
        }
        if(!ObjectId.isValid(rid)){
            return res.status(400).send({status: false, message:  'Not a valid Id'});
        }
        let review = await reviewModel.findById(rid)
        if(!review || review.isDeleted==true){
            return res.status(404).send({status :false, message: 'no review found'})
        }
        const save = await bookModel.findOneAndUpdate( { _id:bid }, {$inc: {reviews:-1}} );
        await reviewModel.updateOne({_id:rid}, {$set : {isDeleted:true}})
        res.status(200).send({status:true, message:"review deleted"})

    }catch(error){
        res.status(500).send({status:false, message: error.message})
    }
}

module.exports = {addReview,updateReview,deleteReview}