import {Router} from 'express';

const router = Router();

// Importing the controller
import * as controller from '../controllers/appController.js';
import {registerMail} from '../controllers/mailer.js';
import Auth, {localVariables} from '../middleware/auth.js';

import CatOrdering from '../model/CatOrdering.js';

// POST methods
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req,res) => res.end()); // authenticate the user
router.route('/login').post(controller.verifyUser, controller.login); // login in app

// GET Methods
router.route('/users').get(controller.getAllUsers); // get all users
router.route('/user/:email').get(controller.getUser); // user with email
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); //generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables

// PUT Methods
router.route("/updateUser").put(Auth, controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password

// DELETE Methods
router.route('/deleteUser').delete(Auth, controller.deleteUser); // delete user


//catering managment
router.route("/add").post(async(req,res)=>{

    const { menuType, noOfPer, fName, lName, email, conNum1, conNum2, date, time, address } = req.body;

    const newCorder = new CatOrdering({
        menuType,
        noOfPer,
        fName,
        lName,
        email,
        conNum1,
        conNum2,
        date,
        time,
        address
    });

    newCorder.save()
        .then(() => {
            res.json("Order Added Successfully.");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error adding order." });
        });
})


router.route("/").get(async (req, res) => {
    
    CatOrdering.find().then((CatOrder) => {
        res.json(CatOrder);
    }).catch((err) => {
        console.log(err);
    });

});


router.route("/update/:id").put(async(req,res)=>{
    let userId = req.params.id;
    const{menuType,noOfPer,fName,lName,email,conNum1,conNum2,date,time,address} = req.body;

    const updateCOrder = {
        menuType,
        noOfPer,
        fName,
        lName,
        email,
        conNum1,
        conNum2,
        date,
        time,
        address
    }

    try {
        const updatedOrder = await CatOrdering.findByIdAndUpdate(userId, updateCOrder);
        if (!updatedOrder) {
            return res.status(404).send({ status: "Error with Updating Order", error: "Order not found" });
        }
        res.status(200).send({ status: "Order Updated Successfully", user: updatedOrder });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with Updating Order", error: err.message });
    }
});


router.route("/delete/:id").delete(async(req,res)=>{
    let userId = req.params.id;

    await CatOrdering.findByIdAndDelete(userId).then(()=>{
        res.status(200).send({status:"Oreder Deleted Succesfully"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"Error with delete order",error:err.message});
    })
})

//reservation Management

router.route("/add").post(async (req, res) => {
    const {
        userName,
        contactNo,
        date,
        time,
        category,
        tNumber,
        nGuest
    } = req.body;

    try {
        const existingReservation = await Reservation.findOne({
            date,
            time,
            category,
            tNumber
        });
    
        if(existingReservation) {
            return res.status(400).json({ message: 'This table is already booked for the selected date and time' });
        }

    const newReservation = new Reservation({
        userName,
        contactNo,
        date,
        time,
        category,
        tNumber,
        nGuest
    });

    
        await newReservation.save();
        res.status(201).json("Reservation Added Successfully.");
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error adding reservation." });
    }
});


// GET all reservations
router.route('/').get(async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'Error', error: err.message });
    }
});

// UPDATE a reservation
router.route('/update/:id').put(async (req, res) => {
    const userId = req.params.id;
    const updateReservation = req.body;

    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(userId, updateReservation, { new: true });
        if (!updatedReservation) {
            return res.status(404).send({ status: 'Error', error: 'Reservation not found' });
        }
        res.status(200).send({ status: 'Reservation Updated Successfully', reservation: updatedReservation });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'Error', error: err.message });
    }
});

// DELETE a reservation
router.route('/delete/:id').delete(async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedReservation = await Reservation.findByIdAndDelete(userId);
        if (!deletedReservation) {
            return res.status(404).send({ status: 'Error', error: 'Reservation not found' });
        }
        res.status(200).send({ status: 'Reservation Deleted Successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'Error', error: err.message });
    }
});

// Route to get a reservation  by ID
router.get("/get/:id", async (req, res) => {
    try {
        const reserve= await Reservation.findById(req.params.id);

        if (!reserve) {
            return res.status(404).json({ error: "reservation not found" });
        }

        res.json(reserve);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching reservation" });
    }
});

export default router;