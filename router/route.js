import {Router} from 'express';
import Item from '../model/inventory_item.js';
import Record from '../model/inventory_records.js';

const router = Router();

// Importing the controller
import * as controller from '../controllers/appController.js';
import {registerMail} from '../controllers/mailer.js';
import Auth, {localVariables} from '../middleware/auth.js';

import CatOrdering from '../model/CatOrdering.js';
import Supplier from '../model/inventory_supplier.js';

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
        res.status(200).send({status:"User deleted"});
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




export default router;