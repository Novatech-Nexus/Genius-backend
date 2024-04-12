import express from 'express';
import {addFeedback, getFeedback} from '../controllers/feedback.controller.js';

const router = express.Router();

router.post("/addFeedback",addFeedback);
router.get("/getFeedback", getFeedback);

export default router;