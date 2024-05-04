import express from 'express';
import {addOrderCart} from '../controllers/orderCartController.js';
import {getOrderCart} from '../controllers/orderCartController.js';
import {getOrderCartById} from '../controllers/orderCartController.js';

//import OrderCart from '../models/orderCartModel.js'; 

const router = express.Router();

// Route to add item to cart
router.post("/addOrderCart", addOrderCart);

// Route to get all items in the order cart
router.get("/getOrderCart", getOrderCart);

// Route to get an item in the order cart by ID
router.get("/getOrderCart/:id", getOrderCartById);

export default router;
