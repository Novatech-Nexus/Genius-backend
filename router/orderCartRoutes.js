import express from 'express';
import {addOrderCart} from '../controllers/orderCartController.js';
import {getOrderCart} from '../controllers/orderCartController.js';
import {getOrderCartById} from '../controllers/orderCartController.js';
import {updateOrderCart} from '../controllers/orderCartController.js';
import {deleteOrderCart} from '../controllers/orderCartController.js';
import {getStatistics} from '../controllers/orderCartController.js';

//import OrderCart from '../models/orderCartModel.js'; 

const router = express.Router();

// Route to add item to cart
router.post("/addOrderCart", addOrderCart);


// Route to get all items in the order cart
router.get("/getOrderCart", getOrderCart);

// Route to get an item in the order cart by ID
router.get("/getOrderCart/:id", getOrderCartById);

// Route to update an item in the order cart
router.put("/updateOrderCart/:id", updateOrderCart);

// Route to delete an item from the order cart
router.delete("/deleteOrderCart/:id", deleteOrderCart);

router.get("/getStatistics", getStatistics);


export default router;
