import {Router} from 'express';
import Employee from '../model/employee.js'

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



export default router;