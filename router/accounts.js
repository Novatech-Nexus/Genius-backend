const express = require('express')
const {
    createAccount,
    getAccount,
    getAccounts,
    deleteAccount,
    updateAccount
} = require('../controller/accountController')

const router = express.Router()

//GET all accounts
router.get('/' , getAccounts )

//GET a single account
router.get('/:id' , getAccount)

//POST a new accounts
router.post('/' , createAccount)

//DELETE a account
router.delete('/:id' , deleteAccount)

//UPDATE a account
router.patch('/:id' , updateAccount)

module.exports = router 