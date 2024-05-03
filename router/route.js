import {Router} from 'express';
import nodemailer from 'nodemailer';
import Swal from 'sweetalert2';


import Employee from '../model/employee.js'
import Salary from '../model/salary.js';

const router = Router();

// Importing the controller
import * as controller from '../controllers/appController.js';
import {registerMail} from '../controllers/mailer.js';
import Auth, {localVariables} from '../middleware/auth.js';

import CatOrdering from '../model/CatOrdering.js';
import Reservation from '../model/reservation.js'

// POST methods
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req,res) => res.end()); // authenticate the user
router.route('/login').post(controller.verifyUser, controller.login); // login in app
router.route('/forgotPassword').post(controller.forgotPassword); // forgot password 01/05
router.route('/getpassword').post(controller.getPassword); //

// GET Methods
router.route('/users').get(controller.getAllUsers); // get all users
router.route('/user/:email').get(controller.getUser); // user with email
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
});

//reservation Management

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'restaurantgenius01@gmail.com',
        pass: 'yvel ttwe eedv zuif'
    }
});

router.route("/addtr").post(async (req, res) => {
    const {
        userName,
        contactNo,
        date,
        email,
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
        email,
        time,
        category,
        tNumber,
        nGuest
    });

    
        await newReservation.save();
        // Send reservation confirmation email
        const mailOptions = {
            from: 'sadaminiimalsha@gmail.com',
            to: email,
            subject: 'Reservation Confirmation',
            text: `Dear ${userName},\n\n` +
                `Your reservation details:\n` +
                `Date: ${date}\n` +
                `Time: ${time}\n` +
                `Category: ${category}\n` +
                `Table Number: ${tNumber}\n` +
                `Number of Guests: ${nGuest}\n\n` +
                `Thank you for your reservation!`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        // Respond with success message
        res.status(201).json({ message: 'Reservation Added Successfully and Confirmation Email Sent.' });
           }catch (err) {
                console.error(err);
                res.status(500).json({ error: "Error adding reservation." });
            }
        });


// GET all reservations
router.route('/tr').get(async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'Error', error: err.message });
    }
});

// UPDATE a reservation



router.route('/updatetr/:id').put(async (req, res) => {
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


router.route('/deletetr/:id').delete(async (req, res) => {
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
router.get("/gettr/:id", async (req, res) => {
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



//Staff management routes
//test
router.get("/test", (req, res) => res.send("Employee routes working"));

router.post("/add", async (req, res) => {
    try {
        const { employeeID, firstname, lastname, gender, nic, email, jobtype, mobile, address, city } = req.body;
  
        // Input validation
        if (!employeeID || !nic) {
            return res.status(400).json({ error: "Missing required fields" });
        }
  
        const newEmployee = new Employee({
            employeeID,
            firstname,
            lastname,
            gender,
            nic,
            email,
            jobtype,
            mobile,
            address,
            city
        });
  
        await newEmployee.save();
        res.json({ message: "Employee added successfully" });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error adding employee" });
      }
  });


router.route("/").get(async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving employees" });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
      const employee = await Employee.findById(req.params.id);

      if (!employee) {
          return res.status(404).json({ error: "Employee not found" });
      }

      res.json(employee);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching employee" });
    }
});



router.put("/update/:id", async (req, res) => {
  try {
      const { employeeID, firstname, lastname, gender, nic, email, jobtype, mobile, address, city } = req.body;

      const updatedEmployee = {
          employeeID,
          firstname,
          lastname,
          gender,
          nic,
          email,
          jobtype,
          mobile,
          address,
          city
      };

      const updatedItem = await Employee.findByIdAndUpdate(req.params.id, updatedEmployee, { new: true });

      if (!updatedItem) {
          return res.status(404).json({ error: "Employee not found" });
      }

      res.json({ message: "Employee updated successfully" });
  } catch (err) {
      console.error(err);
      if (err.name === 'ValidationError') {
          return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Error updating employee" });
    }
});

router.delete("/delete/:id", async (req, res) => {
  try {
      const deletedEmp = await Employee.findByIdAndDelete(req.params.id);

      if (!deletedEmp) {
          return res.status(404).json({ error: "emp not found" });
      }

      res.json({ message: "emp deleted successfully" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting emp" });
    }
});

//staff salary routes
router.post("/addsalary", async (req, res) => {
    try {
        const { employeeID, name, basicamount, othours,amountperhour , month, amount } = req.body;

        // Input validation
        if (!employeeID || !name || !basicamount || !othours || !amountperhour || !month || !amount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newSalary = new Salary({
            employeeID,
            name,
            basicamount,
            othours,
            amountperhour,
            month,
            amount
        });

        await newSalary.save();
        res.json({ message: "Salary assigned successfully" });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error assigning salary" });
    }
});
router.route("/getsal").get(async (req, res) => {
    try {
      const salaries = await Salary.find();
      res.json(salaries);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving employees" });
    }
  });

  router.get("/getsalary/:id", async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id);
  
        if (!salary) {
            return res.status(404).json({ error: "Salary details not found" });
        }
  
        res.json(salary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching details" });
      }
});
router.put("/updatesal/:id", async (req, res) => {
    try {
        const { employeeID, name, basicamount, othours, amountperhour, month, amount } = req.body;

        const updatedSalary = {
            employeeID,
            name,
            basicamount,
            othours,
            amountperhour,
            month,
            amount
        };

        const updatedItem = await Salary.findByIdAndUpdate(req.params.id, updatedSalary, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ error: "Salary details not found" });
        }

        res.json({ message: "Salary details updated successfully" });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error updating salary details" });
    }
});


  router.delete("/deletesalary/:id", async (req, res) => {
    try {
        const deletedSal = await Salary.findByIdAndDelete(req.params.id);
  
        if (!deletedSal) {
            return res.status(404).json({ error: "employee name cannot not found" });
        }
  
        res.json({ message: "salary details deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting Salary details" });
      }
  });



export default router;