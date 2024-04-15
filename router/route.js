import {Router} from 'express';
import Employees from '../model/employee.js';

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


//Staff management routes
//test
router.get("/test", (req, res) => res.send("Employee routes working"));

router.post("/", (req, res) => {
  Employees.create(req.body)
    .then(() => res.json({ msg: "Employee added successfully" }))
    .catch(() => res.status(400).json({ msg: "Employee adding failed" }));
});

router.get("/", (req, res) => {
  Employees.find()
    .then((employees) => res.json(employees))
    .catch(() => res.status(400).json({ msg: "No employees found" }));
});

router.get("/:id", (req, res) => {
  Employees.findById(req.params.id)
    .then((employee) => res.json(employee))
    .catch(() => res.status(400).json({ msg: "Cannot find this employee" }));
});

router.put("/:id", (req, res) => {
  Employees.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({ msg: "Update Successfully" }))
    .catch(() => res.status(400).json({ msg: "Update failed" }));
});

router.delete("/:id", (req, res) => {
  Employees.findByIdAndDelete(req.params.id)
    .then(() => res.json({ msg: "Delete successfully" }))
    .catch(() => res.status(400).json({ msg: "Cannot delete" }));
});


export default router;