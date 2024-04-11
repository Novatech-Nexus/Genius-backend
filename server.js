import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import morgan from 'morgan'; //is used to log all the http requests inside the console
//import connect from './database/connection.js';
import router from './router/route.js';
import bodyParser from "body-parser";
import feedbackRouter from './router/feedback.route.js';
import dotenv from "dotenv";

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
    console.log('connected to mongoDB');
    }).catch((err) => {
        console.log(err);
    })

const app= express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable('x-powered-by'); //less hackers know about our stack
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050; // Use PORT from environment variable if available

//HTTP GET request
app.get('/', (req, res) => {
    res.status(201).json("Home GET request");
});

// API routes
app.use('/api', router);

//route Feedback 
app.use("/api/feedback",feedbackRouter);

//start server when we have a valid connection
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}!`);
    }
);

