import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; //is used to log all the http requests inside the console
import connect from './database/connection.js';
import router from './router/route.js';
import bodyParser from 'body-parser';


import orderRoutes from './router/orderRoutes.js';
import orderCartRoutes from './router/orderCartRoutes.js';

const app= express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable('x-powered-by'); //less hackers know about our stack
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



const PORT = process.env.PORT ||8099;

//HTTP GET request
app.get('/', (req, res) => {
    res.status(201).json("Home GET request");
});

// API routes
app.use('/api', router);


//catering
app.use('/CatOrdering', router);

//Reservation
app.use('/Reservation', router);

 //route Order-user details 
 app.use('/api/orders', orderRoutes);
 app.use('/api/orderCart', orderCartRoutes);

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