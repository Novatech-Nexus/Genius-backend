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


export default router;