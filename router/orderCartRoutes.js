import express from 'express';
import {addOrderCart} from '../controllers/orderCartController.js';
//import OrderCart from '../models/orderCartModel.js'; 

const router = express.Router();

// Route to add item to cart
router.post("/addOrderCart", addOrderCart);

export default router;
