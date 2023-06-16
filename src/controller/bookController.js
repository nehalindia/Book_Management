const bookModel = require('../models/bookModel')

const createBook = async (req,res) => {
    try{
        let data = req.body
        if(!data.title){
            return res.status(400).send({status :false, message: "Must add title"})
        }
        const existingUser = await bookModel.findOne({ title: data.title });
        if(existingUser) {
                return res.status(400).send({status: false, message:  'Book title already exists'});
        }

        if(!data.excerpt){
            return res.status(400).send({status :false, message: "Must add excerpt"})
        }

        if(!data.userId){
            return res.status(400).send({status :false, message: "Must add userId"})
        }
        // if(!data.userId==req.userId){
        //     return res.status(401).send({status :false, message: "userId not matched"})
        // }

        if(!data.ISBN){
            return res.status(400).send({status :false, message: "Must add isbn number"})
        }
        if(data.ISBN.length < 13 ){
            return res.status(400).send({status:false, message:" Not a valid ISBN"})
        }
        const exist = await bookModel.findOne({ ISBN: data.ISBN });
        if(exist) {
            return res.status(400).send({status: false, message:  'Book ISBN already exists'});
        }

        if(!data.category){
            return res.status(400).send({status: false, message:  'Category must add'});
        }
        if(!data.subcategory){
            return res.status(400).send({status: false, message:  'subCategory must add'});
        }
        if(!data.releasedAt){
            return res.status(400).send({status: false, message:  'must add release date'});
        }

        let book = await bookModel.create(data)
        let resbook = {_id:book._id, title:book.title, excerpt:book.excerpt, userId:book.userId, ISBN:book.ISBN,
        category:book.category, subcategory:book.subcategory,isDeleted:book.isDeleted, reviews:book.reviews,releasedAt:
        book.releasedAt,createdAt:book.createdAt, updatedAt:book.updatedAt}
        return res.status(201).send({status: true, data: resbook})
    }catch(error){
        res.status(500).send({status: false, message:  error.message})
    }

}


module.exports ={createBook}