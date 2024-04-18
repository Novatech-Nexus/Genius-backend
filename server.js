import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; //is used to log all the http requests inside the console
import connect from './database/connection.js';
import router from './router/route.js';
 
 
const app= express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable('x-powered-by'); //less hackers know about our stack
 
 
const PORT = 8080;
 
//HTTP GET request
app.get('/', (req, res) => {
    res.status(201).json("Home GET request");
});
 
// API routes
app.use('/api', router);
app.use("/employee", router);
 
 
 
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