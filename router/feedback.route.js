import express from 'express';
import {addFeedback, getFeedback, deleteFeedback, updateFeedback, approveFeedback, getFeedbackApproval} from '../controllers/feedback.controller.js';

const router = express.Router();

router.post("/addFeedback",addFeedback);
router.get("/getFeedback", getFeedback);
router.delete("/deleteFeedback/:id", deleteFeedback);
router.put("/updateFeedback/:id", updateFeedback);
router.put("/approveFeedback/:id", approveFeedback);
router.get("/getFeedbackApproval", getFeedbackApproval);

export default router;