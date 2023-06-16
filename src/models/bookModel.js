// { 
//     title: {string, mandatory, unique},
//     excerpt: {string, mandatory}, 
//     userId: {ObjectId, mandatory, refs to user model},
//     ISBN: {string, mandatory, unique},
//     category: {string, mandatory},
//     subcategory: {string, mandatory},
//     reviews: {number, default: 0, comment: Holds number of reviews of this book},
//     deletedAt: {Date, when the document is deleted}, 
//     isDeleted: {boolean, default: false},
//     releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title is mandatory'],
        unique:true
    },
    excerpt:{
        type:String,
        required:[true,'excerpt is mandatory']
    },
    userId:{
        type:ObjectId,
        required:[true,'userId is mandatory'],
        ref:'user' 
    },
    ISBN: {
        type:String,
        required : [true,'isbn is mandatory'], 
        unique : true
    },
    category: {
        type:String,
        required:[true,'category is mandatory']
    },
    subcategory: {
        type: String,
        required:[true,'subcategory is mandatory']
    },
    reviews: {
        type: Number, 
        default: 0, 
        comment: "Holds number of reviews of this book"
    },
    deletedAt: {
        type:Date,
        default: null
    }, 
    isDeleted: {
        type :Boolean, 
        default: false
    },
    releasedAt: {
        type:Date, 
        required:[true,'realese is mandatory']
    //    format("YYYY-MM-DD")
    },
},{timestamps:true})

module.exports = mongoose.model('book',bookSchema)