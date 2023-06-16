const express = require('express')
const router = express.Router()

const {createUser, login} = require('../controller/userController')
const {createBook} = require('../controller/bookController')

router.post('/register',createUser)
router.post('/login',login)

router.post('/book',createBook)


module.exports = router