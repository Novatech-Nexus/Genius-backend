// Import necessary modules
import express from 'express';
const router = express.Router();
import Menu from '../model/Menus.js';

// Route to add a new menu item
router.post("/add", async (req, res) => {
    try {
        const { itemId, itemName, price, description, category } = req.body;

        // Input validation
        if (!itemId || !itemName || !price || !category) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a newMenu 
        const newMenuData = {
            itemId,
            itemName,
            category,
            price,
        };

        // Add the description field if provided
        if (description) {
            newMenuData.description = description;
        }

        const newMenu = new Menu(newMenuData);

        await newMenu.save();
        res.json({ message: "Item added successfully" });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error adding item" });
    }
});

// get all menu items
router.get("/", async (req, res) => {
    try {
        const items = await Menu.find();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching items" });
    }
});

// update a menu item
router.put("/update/:id", async (req, res) => {
    try {
        const { itemId, itemName, price, description, category } = req.body;

        const updatedMenu = {
            itemId,
            itemName,
            category,
            price,
            description
        };

        const updatedItem = await Menu.findByIdAndUpdate(req.params.id, updatedMenu, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Menu updated successfully" });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error updating menu" });
    }
});

// delete a menu item
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedItem = await Menu.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Menu item deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting menu item" });
    }
});

// get a menu item by ID
router.get("/get/:id", async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);

        if (!menu) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json(menu);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching menu item" });
    }
});

export default router;
