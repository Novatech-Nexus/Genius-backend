import {Router} from 'express';

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
router.route('/updateUser/:id').put(controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.resetPassword); // use to reset password

export default router;