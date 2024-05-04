import OrderCart from '../model/orderCartModel.js';

export const addOrderCart = async (req, res, next) => {
  try {
    const orderDetails = req.body; // This should be an array of items

    // Calculate netTotal by summing up the totalPrice of each item
    const netTotal = orderDetails.reduce((total, item) => total + item.totalPrice, 0);

    const newOrderCart = await OrderCart.create({ 
      items: orderDetails,
      netTotal: netTotal,  // Include the netTotal in the creation of the order cart
      createdAt: new Date() // Automatically set the createdAt field to current date and time
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

// Function to get an item in the order cart by ID
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

// Function to update an item in the order cart
export const updateOrderCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedOrderCart = req.body;

    const result = await OrderCart.findByIdAndUpdate(id, updatedOrderCart, { new: true });

    if (!result) {
      return res.status(404).json({ error: "Order cart item not found" });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Function to delete an item from the order cart
export const deleteOrderCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrderCart = await OrderCart.findByIdAndDelete(id);

    if (!deletedOrderCart) {
      return res.status(404).json({ error: "Order cart item not found" });
    }

    res.json({ message: "Order cart item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req, res) => {
  try {
    const totalItemsSold = await OrderCart.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalQuantity: { $sum: "$items.amount" } } }
    ]);

    const incomeByFoodItem = await OrderCart.aggregate([
      { $unwind: "$items" },
      { 
        $group: { 
          _id: "$items.name", // Group by food item name
          incomeByFoodItem: { $sum: "$items.totalPrice" } // Calculate the sum of totalPrice for each group
        } 
      }
    ]);
    
    const totalIncome = await OrderCart.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, totalIncome: { $sum: "$items.totalPrice" } } }
    ]);

    res.status(200).json({ totalItemsSold, incomeByFoodItem, totalIncome });
  } catch (error) {
    res.status(500).json({ error: "Failed to get statistics" });
  }
};


