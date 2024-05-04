import OrderCart from '../model/orderCartModel.js';

export const addOrderCart = async (req, res, next) => {
  try {
    const orderDetails = req.body; // This should be an array of items

    // Calculate netTotal by summing up the totalPrice of each item
    const netTotal = orderDetails.reduce((total, item) => total + item.totalPrice, 0);

    const newOrderCart = await OrderCart.create({ 
      items: orderDetails,
      netTotal: netTotal  // Include the netTotal in the creation of the order cart
    });

    res.status(201).json(newOrderCart); // Send back the created order cart object
  } catch (error) {
    next(error); // Forwarding error to error handling middleware
  }
};

export const getOrderCart = async (req, res, next) => {
  try {
    const orderCarts = await OrderCart.find();
    res.json(orderCarts);
  } catch (error) {
    next(error);
  }
};

export const getOrderCartById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderCart = await OrderCart.findById(id);
    
    if (!orderCart) {
      return res.status(404).json({ error: "Order cart item not found" });
    }
    
    res.json(orderCart);
  } catch (error) {
    next(error);
  }
};


