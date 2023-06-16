// {
//     bookId: {ObjectId, mandatory, refs to book model},
//     reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
//     reviewedAt: {Date, mandatory},
//     rating: {number, min 1, max 5, mandatory},
//     review: {string, optional}
//     isDeleted: {boolean, default: false},
// }

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const reviewModel = new mongoose.Schema({
    bookId: {
        type:ObjectId,
        required:[true,'bookid is mandatory'],
        ref :'book'
    },
    reviewedBy: {
        type:String,
        required:[true,'user name is mandatory'],
        default :'Guest'
        // value: reviewer's name
    },
    reviewedAt: {
        type:Date, 
        required:[true,'review date is mandatory'],
    },
    rating: {
        type: Number, 
        min :1, 
        max :5, 
        required:[true,'rating is mandatory'],
    },
    review: {
        type : String
    },
    isDeleted: {
        type:Boolean, 
        default: false
    },
},{timestamps:true})


module.exports = mongoose.model('review',reviewModel)