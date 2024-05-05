import Order from '../model/orderModel.js';

// Add new order
export const addOrder = async (req, res, next) => {

    // Destructuring request body
    const { name, address, contactNumber, email, specialInstructions} = req.body;
    
    // Creating a new order with the provided data
    const newOrder = new Order({ name, address, contactNumber, email, specialInstructions });
    
    try {
      await newOrder.save(); // Saving the new order
      res.status(201).json('Order created successfully!'); // Sending success response
    } catch (error) {
      next(error); // Forwarding error to error handling middleware
    }
};

// Get all order
export const getOrderInfo = async (req, res, next) => {
    try {
      // Fetching all order data
      const orderInfo = await Order.find();
      res.status(200).json(orderInfo);  // Sending order data as response
    } catch (error) {
      next(error);
    }
  };

export const getOrder = async (req, res, next) => {
    try {
        // Fetch the most recent order (latest entry)
        const orderData = await Order.findOne().sort({ _id: -1 });
        if (!orderData) {
            return res.status(404).json({ success: false, message: 'No order found.' });
        }
        res.status(200).json(orderData);
    } catch (error) {
        next(error);
    }
};

// Delete order by ID
export const deleteOrder = async (req, res, next) => {
    const { id } = req.params; // Assuming the order entry ID is passed as a URL parameter
    try {
      // Deleting order by ID
      const deleteOrder = await Order.findByIdAndDelete(id);
      if (!deleteOrder) {
        // If order not found, sending error response
        return res.status(404).json({ success: false, message: 'Order not found.' }); 
      }
      // Sending success response
      res.status(200).json({ success: true, message: 'Order deleted successfully.' });
    } catch (error) {
      next(error);
    }
  };

  // Update order by ID
export const updateOrder = async (req, res, next) => {

    // Extracting order ID from request parameters
    const { id } = req.params;
  
    // Destructuring updated data from request body
    const { name, address, contactNumber, email, specialInstructions } = req.body;
    try {
      // Find the existing order
      const existingOrder = await Order.findById(id);
      if (!existingOrder) {
        return res.status(404).json({ success: false, message: 'Detail not found.' });
      }
  
      // Updating order by ID
      const updatedOrder = await Order.findByIdAndUpdate(id, { name, address, contactNumber, email, specialInstructions }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: 'Detail not found.' });
      }
  
      // Sending success response with updated order data
      res.status(200).json({ success: true, message: 'Detail updated successfully.', Order: updatedOrder });
    } catch (error) {
      next(error);
    }
  };