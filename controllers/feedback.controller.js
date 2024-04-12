import feedback from "../model/feedback.model.js";

// Add new feedback
export const addFeedback = async (req, res, next) => {

    // Destructuring request body
    const { name, email, message, rating, diningExperience, foodQuality, service, price, menuSelection, onlineSelection, cateringSelection, responseSelection } = req.body;
    
    // Creating a new feedback with the provided data
    const newFeedback = new feedback({ name, email, message, rating, diningExperience, foodQuality, service, price, menuSelection, onlineSelection, cateringSelection, responseSelection });
    
    try {
      await newFeedback.save(); // Saving the new feedback
      res.status(201).json('Feedback created successfully!'); // Sending success response
    } catch (error) {
      next(error); // Forwarding error to error handling middleware
    }
};


// Get all feedback
export const getFeedback = async (req, res, next) => {
  try {
    // Fetching all feedback data
    const feedbackData = await feedback.find();
    res.status(200).json(feedbackData);  // Sending feedback data as response
  } catch (error) {
    next(error);
  }
};


// Delete feedback by ID
export const deleteFeedback = async (req, res, next) => {
  const { id } = req.params; // Assuming the feedback entry ID is passed as a URL parameter
  try {
    // Deleting feedback by ID
    const deletedFeedback = await feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      // If feedback not found, sending error response
      return res.status(404).json({ success: false, message: 'Feedback not found.' }); 
    }
    // Sending success response
    res.status(200).json({ success: true, message: 'Feedback deleted successfully.' });
  } catch (error) {
    next(error);
  }
};