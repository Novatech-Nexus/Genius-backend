import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; //is used to log all the http requests inside the console
import connect from './database/connection.js';
import router from './router/route.js';
//import menuRouter from "./router/menus.js"; // Import menuRouter


const app= express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable('x-powered-by'); //less hackers know about our stack


const PORT = process.env.PORT || 5050; // Use PORT from environment variable if available

//HTTP GET request
app.get('/', (req, res) => {
    res.status(201).json("Home GET request");
});

// API routes
app.use('/api', router);

// Mount the menuRouter at the '/item' endpoint
app.use("/item", router);


//start server when we have a valid connection
connect().then( () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server connected to http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log("Cannot connect to the server")
    }
}).catch(error => {
    console.log("Invalid database connection.");
})

// //IT22114808
// const menuRouter = require("./routes/menus.js");
// app.use("/item", menuRouter);

// app.listen(PORT, () => {
//   console.log(`Server is up and running on port ${PORT}`);
// });

