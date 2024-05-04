import {Router} from 'express';
import nodemailer from 'nodemailer';
import Swal from 'sweetalert2';


import Employee from '../model/employee.js'
import Salary from '../model/salary.js';
import Item from '../model/inventory_item.js';
import Record from '../model/inventory_records.js';

const router = Router();

// Importing the controller
import * as controller from '../controllers/appController.js';
import {registerMail} from '../controllers/mailer.js';
import Auth, {localVariables} from '../middleware/auth.js';
import { supplierMail } from '../controllers/suppliermail.js';
import CatOrdering from '../model/CatOrdering.js';
import Reservation from '../model/reservation.js'
import Supplier from '../model/inventory_supplier.js';

// POST methods
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req,res) => res.end()); // authenticate the user
router.route('/login').post(controller.verifyUser, controller.login); // login in app
router.route('/forgotPassword').post(controller.forgotPassword); // forgot password 01/05
router.route('/getpassword').post(controller.getPassword); //
router.route('/empLogin').post(controller.verifyEmp, controller.empLogin); //login for employees

// GET Methods
router.route('/users').get(controller.getAllUsers); // get all users
router.route('/user/:email').get(controller.getUser); // user with email

// PUT Methods
router.route("/updateUser").put(Auth, controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password

// DELETE Methods
router.route('/deleteUser').delete(Auth, controller.deleteUser); // delete user
router.route('/deleteAnUser/:id').delete(controller.deleteAnuser); // delete user by id


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
            from: 'restaurantgenius01@gmail.com',
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

const reservationId = 'your_reservation_id_here'; // Replace this with the ID of the reservation you want to fetch

// Make a GET request to fetch the reservation
const fetchReservation = async () => {
    try {
      const response = await fetch(`/gettr/${reservationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reservation');
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setReservation(data);
      } else {
        throw new Error('Response is not valid JSON');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  


// UPDATE a reservation


router.route('/updatetr/:id').put(async (req, res) => {
    const userId = req.params.id;
    const updateReservation = req.body;

    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(userId, updateReservation, { new: true });
        
        if (!updatedReservation) {
            return res.status(404).send({ status: 'Error', error: 'Reservation not found' });
        }

        

        const mailOptions = {
            from: 'restaurantgenius01@gmail.com',
            to: updatedReservation.email, // Customer's email address
            subject: 'Reservation Updated',
            text: `Dear ${updatedReservation.userName},\n\n` +
                  `Your reservation has been updated successfully:\n` +
                  `New Date: ${updatedReservation.date}\n` +
                  `New Time: ${updatedReservation.time}\n` +
                  `New Category: ${updatedReservation.category}\n` +
                  `New Table Number: ${updatedReservation.tNumber}\n` +
                  `New Number of Guests: ${updatedReservation.nGuest}\n\n` +
                  `Thank you for choosing our service!`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ status: 'Reservation Updated Successfully', reservation: updatedReservation });
    } catch (err) {
        console.error('Error updating reservation:', err);
        res.status(500).send({ status: 'Error', error: err.message });
    }
});


// DELETE a reservation


router.delete('/deletetr/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedReservation = await Reservation.findByIdAndDelete(id);
  
      if (!deletedReservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
  
      // Send reservation deletion email notification
      const mailOptions = {
        from: 'restaurantgenius01@gmail.com',
        to: deletedReservation.email,
        subject: 'Reservation Deleted',
        text: `Dear ${deletedReservation.userName},\n\n` +
              `Your reservation with Name ${deletedReservation.userName}\n` + // Fixed concatenation here
              `Date: ${deletedReservation.date}\n` +
              `Time: ${deletedReservation.time}\n` +
              `Category: ${deletedReservation.category}\n` +
              `Table Number: ${deletedReservation.tNumber}\n` +
              `Number of Guests: ${deletedReservation.nGuest}\n\n` +
              `has been successfully deleted.\n\n` +
              `Thank you for choosing our service!`
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      res.status(500).json({ error: 'Error deleting reservation' });
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





//inventory //////////////////////////////////////////////////////////////////////////////////////////////

router.route("/addinventory").post((req,res)=>{
    const code = req.body.inputCode;
    const name = req.body.inputName;
    const igroup = req.body.inputIgroup;
    const quantity =req.body.inputQuentity;
    const kg = req.body.inputKg;
    const cost = req.body.inputCost;
    const addDate = req.body.inputDate;
    const discription = req.body.inputDiscription;

    const newItem = new Item({
        code,
        name,
        igroup,
        quantity,
        kg,
        cost,
        addDate,
        discription
    })
    newItem.save().then(()=>{
        res.json("New item added")
    }).catch(((err)=>{
        console.log(err);
    }))

})
router.route("/getinventory").get((req,res)=>{
    Item.find().then((item)=>{
        res.json(item)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/updateinventory/:id").put(async(req,res)=>{
    let itemId = req.params.id;
    const {code,name,igroup,quantity,kg,cost,addDate} = req.body;
    
    const updateItem = {
        code,
        name,
        igroup,
        quantity,
        kg,
        cost,
        addDate
    }
    const update = await Item.findByIdAndUpdate(itemId,updateItem)
    .then(()=>{
        res.status(200).send({status:"user updated"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status :"Error with updating data",error:err.message});
    })

})

router.route("/deleteinventory/:id").delete(async(req,res)=>{
    let itemId = req.params.id;
    await Item.findByIdAndDelete(itemId)
    .then(()=>{
        res.status(200).send({status:"User deleted"});
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status :"Error with delete data",error:err.message});
    })
})
router.route("/getinventory/:id").get(async(req,res)=>{
    let itemId = req.params.id;
    const item =  await Item.findById(itemId)
    .then((item)=>{
        // res.status(200).send({status:"User fetched",item});
        res.status(200).send(item);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status :"Error with fetched data",error:err.message});
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/addrecord").post((req,res)=>{
    const recId = req.body.updateCode;
    const recQuantity = req.body.Recordquantity;
    const recKg = req.body.updateKg;
    const recIn = req.body.isIncomeSelected;
    const recOut = req.body.isOutgoingSelected;
    const recCost = req.body.updateCost;
    const recDate = req.body.newDate;

    const newRecord = new Record({
        recId,
        recQuantity,
        recKg,
        recIn,
        recOut,
        recCost,
        recDate
    })
    newRecord.save().then(()=>{
        res.json("New record added")
    }).catch(((err)=>{
        console.log(err);
    }))

})

router.route("/getrecord").get((req,res)=>{
    Record.find().then((record)=>{
        res.json(record)
    }).catch((err)=>{
        console.log(err)
    })
})
router.route("/deleterecord/:id").delete(async(req,res)=>{
    let recordId = req.params.id;
    await Record.findByIdAndDelete(recordId)
    .then(()=>{
        res.status(200).send({status:"record deleted"});
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status :"Error with delete data",error:err.message});
    })
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.route("/addsupplier").post((req,res)=>{
    const suppID = req.body.inputId;
    const suppName = req.body.inputName;
    const suppEmail = req.body.inputEmail;
    const suppPhone =  req.body.inputPhone;
    const suppDisc = req.body.inputDisc;

    const newSupplier = new Supplier({
        suppID,suppName,suppEmail,suppPhone,suppDisc

    })
    newSupplier.save().then(()=>{
        res.json("New item added")
    }).catch(((err)=>{
        console.log(err);
    }))

})
router.route("/getsupplier").get((req,res)=>{
    Supplier.find().then((supplier)=>{
        res.json(supplier)
    }).catch((err)=>{
        console.log(err)
    })
})
router.route("/updatesupplier/:id").put(async(req,res)=>{
    let supplierID = req.params.id;
    const {suppID,suppName,suppEmail,suppPhone,suppDisc} = req.body;
    
    const updateSupplier = {
        suppID,suppName,suppEmail,suppPhone,suppDisc
    }
    const update = await Supplier.findByIdAndUpdate(supplierID,updateSupplier)
    .then(()=>{
        res.status(200).send({status:"user updated"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status :"Error with updating data",error:err.message});
    })

})
router.route("/getsupplier/:id").get(async(req,res)=>{
    let supplierId = req.params.id;
    const supplier =  await Supplier.findById(supplierId)
    .then((supplier)=>{
        // res.status(200).send({status:"User fetched",item});
        res.status(200).send(supplier);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status :"Error with fetched data",error:err.message});
    })
})

router.route("/deletesupplier/:id").delete(async(req,res)=>{
    let supplierId = req.params.id;
    await Supplier.findByIdAndDelete(supplierId)
    .then(()=>{
        res.status(200).send({status:"User deleted"});
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status :"Error with delete data",error:err.message});
    })
})
router.route('/suppliermail').post(supplierMail) // send the email

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export default router;