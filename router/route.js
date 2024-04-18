import {Router} from 'express';
const router = Router();

// Importing the controller
import * as controller from '../controllers/appController.js';
import {registerMail} from '../controllers/mailer.js';
import Auth, {localVariables} from '../middleware/auth.js';

// POST methods
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req,res) => res.end()); // authenticate the user
router.route('/login').post(controller.verifyUser, controller.login); // login in app


// GET Methods
router.route('/user/').get(controller.getUser); // get all users
router.route('/user/:email').get(controller.getUser); // user with email
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); //generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables


// PUT Methods
router.route("/updateUser").put(Auth, controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password

export default router;