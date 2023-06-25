// { 
//     title: {string, mandatory, enum[Mr, Mrs, Miss]},
//     name: {string, mandatory},
//     phone: {string, mandatory, unique},
//     email: {string, mandatory, valid email, unique}, 
//     password: {string, mandatory, minLen 8, maxLen 15},
//     address: {
//       street: {string},
//       city: {string},
//       pincode: {string}
//     },
//     createdAt: {timestamp},
//     updatedAt: {timestamp}
//   }

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    title: {
        type: String,
        required :[true,'Must add title'], 
        enum: ['Mr', 'Mrs', 'Miss']
    },
    name: {
        type: String,
        required: [true,'name is mandotory']
    },
    phone: {
        type :String,
        required:[true, 'must add phone number'],  
        unique : true,
        trim : true
    },
    email: {
        type : String,
        trim : true,
        required:[true,'must add email'],
        lowercase:true,
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            }, message: 'Please fill a valid email address', isAsync: false
        },
        unique: true
    }, 
    password: {
        type: String,  
        trim : true,
        required:[true, 'must add strong password'], 
        minlength :8, 
        maxlength :15
    },
    address: {
      street: String,
      city: String,
      pincode: String
    }

},{timestamps: true})

module.exports = mongoose.model('user',userSchema)