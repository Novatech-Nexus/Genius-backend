import {Router} from 'express';
import CatOrdering from '../model/CatOrdering.js';

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




//catering managment
router.post("/add", async (req, res) => {
    const { functionType,menuType, noOfPer, fName, lName, email, conNum1, conNum2, date, time, address, perPersonPrice, totalPrice } = req.body;

    const newCorder = new CatOrdering({
        functionType,
        menuType,
        noOfPer,
        fName,
        lName,
        email,
        conNum1,
        conNum2,
        date,
        time,
        address,
        perPersonPrice,
        totalPrice
    });

    try {
        await newCorder.save();
        res.json("Order Added Successfully.");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error adding order." });
    }
});

// Get all orders
router.get("/", async (req, res) => {
    try {
        const orders = await CatOrdering.find();
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching orders." });
    }
});

// Update order
router.put("/update/:id", async (req, res) => {
    const userId = req.params.id;
    const { functionType, menuType, noOfPer, fName, lName, email, conNum1, conNum2, date, time, address, perPersonPrice, totalPrice } = req.body;

    const updateCOrder = {
        functionType,
        menuType,
        noOfPer,
        fName,
        lName,
        email,
        conNum1,
        conNum2,
        date,
        time,
        address,
        perPersonPrice,
        totalPrice
    };

    try {
        const updatedOrder = await CatOrdering.findByIdAndUpdate(userId, updateCOrder, { new: true });
        if (!updatedOrder) {
            return res.status(404).send({ status: "Error with Updating Order", error: "Order not found" });
        }
        res.status(200).send({ status: "Order Updated Successfully", user: updatedOrder });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with Updating Order", error: err.message });
    }
});

// Delete order
router.delete("/delete/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedOrder = await CatOrdering.findByIdAndDelete(userId);
        if (!deletedOrder) {
            return res.status(404).send({ status: "Error with Deleting Order", error: "Order not found" });
        }
        res.status(200).send({ status: "Order Deleted Successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with Deleting Order", error: err.message });
    }
});


// Route to get a catering item by ID
router.get("/get/:id", async (req, res) => {
    try {
        const catget = await CatOrdering.findById(req.params.id);

        if (!catget) {
            return res.status(404).json({ error: "id not found" });
        }

        res.json(catget);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching catering order" });
    }
});
export default router;