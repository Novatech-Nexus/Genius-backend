import {Router} from 'express';
import Menu from "../model/Menu.js";

const router = Router();

import * as controller from '../controllers/appController.js';

// POST methods
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(); // send the email
router.route('/authenticate').post((req,res) => res.end()); // authenticate the user
router.route('/login').post(controller.verifyUser, controller.login); // login in app


// GET Methods
router.route('/user/:email').get(controller.getUser); // user with email
router.route('/generateOTP').get(controller.generateOTP); //generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP); //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables


// PUT Methods
router.route('/updateUser').put(controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.resetPassword); // use to reset password



//MenuManagement

// Route to add a new menu item
router.post("/add", async (req, res) => {
    try {
        const { itemId, itemName, price, description, category } = req.body;

        // Input validation
        if (!itemId || !itemName || !price || !description || !category) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newMenu = new Menu({
            itemId,
            itemName,
            category,
            price,
            description
        });

        await newMenu.save();
        res.json({ message: "Item added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error adding item" });
    }
});

// Route to get all menu items
router.get("/", async (req, res) => {
    try {
        const items = await Menu.find();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching items" });
    }
});

// Route to update a menu item
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
        res.status(500).json({ error: "Error updating menu" });
    }
});

// Route to delete a menu item
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

// Route to get a menu item by ID
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


