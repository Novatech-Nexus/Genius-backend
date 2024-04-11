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