// require('dotenv').config()

// const express = require('express')
// const mongoose = require('mongoose')
// const accountsRoutes = require('./routes/accounts')


// //express app
// const app = express()

// //middleware
// app.use(express.json())

// app.use((req, res, next) =>
// {
//     console.log(req.path , req.method)
//     next()
// })

// //routes
// app.use('/api/accounts',accountsRoutes)

// //connect to db
// mongoose.connect(process.env.MONGO_URI )
//     .then(() => {
//         //listern for requests
//         app.listen(process.env.PORT , () =>
//         {
//             console.log('connected to db listeneing on port ' , process.env.PORT)
//         })

//     })
//     .catch((error) => {
//         console.log(error)
//     })



