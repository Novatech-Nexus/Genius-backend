import express from 'express';
import { addOrder, deleteOrder, getOrder, updateOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post("/addOrder",addOrder);
router.get("/getOrder", getOrder);
router.delete("/deleteOrder/:id", deleteOrder);
router.put("/updateOrder/:id", updateOrder);


export default router;