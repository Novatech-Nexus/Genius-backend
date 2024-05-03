import {Router} from 'express';
import Employee from '../model/employee.js'
import Salary from '../model/salary.js';

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