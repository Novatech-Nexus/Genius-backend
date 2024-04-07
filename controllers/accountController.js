const Account = require('../models/accountmodel');

const mongoose = require('mongoose')


//get all accounts
const getAccounts = async (req, res) =>{
    const accounts = await Account.find({}).sort({createdAt: -1})

    res.status(200).json(accounts)
}


//get a single account
const getAccount = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such account'})
    }

    const account = await Account.findById(id)

    if(!account){
        return res.status(404).json({error: 'No such account'})
    }

    res.status(200).json(account)
}


//create new account
const createAccount = async (req, res) =>
{
    const {userName,contactNo, date, time, category, nGuest} = req.body
 
    //add doc to db
    try {
        const account = await Account.create({userName,contactNo, date, time, category, nGuest})
        res.status(200).json(account)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


//delete a account
const deleteAccount = async(req, res) =>
{
    const { id } = req.params

    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such account'})
    }

    const account = await Account.findOneAndDelete({_id: id})

    if(!account){
        return res.status(400).json({error: 'No such account'})
    }

    res.status(200).json(account)


}

//update a account
const updateAccount = async (req, res) =>{
    const { id } = req.params

    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such account'})
    }

    const account = await Account.findOneAndUpdate({_id: id},{

        ...req.body

    })

    if(!account){
        return res.status(400).json({error: 'No such account'})
    }

    res.status(200).json(account)
}


module.exports = {
    getAccount,
    getAccounts,
    createAccount,
    deleteAccount,
    updateAccount
}