const express = require('express')
const router = express.Router()

const {createUser, login} = require('../controller/userController')
const {createBook, getBook, getBookbyId, updateBook, deleteBook} = require('../controller/bookController')
const {} = require('../controller/reviewController')

router.post('/register',createUser)
router.post('/login',login)

router.post('/books',createBook)
router.get('/books',getBook)
router.get('/books/:bookId',getBookbyId)
router.put('/books/:bookId',updateBook)
router.delete('/books/:bookId',deleteBook)




router.all('*', async (req, res) => {
    return res.status(404).send({status: false, message: "invalid url"})
})
module.exports = router