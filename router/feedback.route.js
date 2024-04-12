import express from 'express';
import {addFeedback, getFeedback, deleteFeedback} from '../controllers/feedback.controller.js';

const router = express.Router();

router.post("/addFeedback",addFeedback);
router.get("/getFeedback", getFeedback);
router.delete("/deleteFeedback/:id", deleteFeedback);

export default router;