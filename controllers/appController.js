import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
//import ENV from '../config.js';


config();

/**Middleware for verify user*/
export async function verifyUser(req, res, next){
  try {
      const { email } = req.method == "GET" ? req.query : req.body;

      //Check the user existance
      let exist = await UserModel.findOne({ email});
      if(!exist) return res.status(404).send({ error: "Cannot find the email "});
      next(); 

  } catch (error) {
      return res.status(404).send({ error: "Authentication error "})
  }
}


// Register function
export async function register(req, res) {
  try {
    const { profile, firstname, lastname, email, phoneNumber, password } = req.body;

    // Check if email already exists (more concise using async/await)
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "This email is already registered." });
    }

    // Hash password securely with appropriate work factor
    const saltRounds = 10; // Adjust based on security needs
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save new user using async/await for clarity
    const user = new UserModel({
      profile: profile || '',
      firstname,
      lastname,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await user.save();

    // Send successful registration response
    res.status(201).send({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({ error: "Registration failed" }); // Generic error message for the user
  }
}

// Login function
// User kiyalamai variable ekak haduwe methana: "const user = await UserModel.findOne({ email });"
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).send({ error: "Email not found" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) return res.status(400).send({ error: "Password incorrect" });

    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, ENV.JWT_SECRET, { expiresIn: "24h" });
    return res.status(200).send({ msg: "Login successful", email: user.email, token });
  } catch (error) {
    return res.status(500).send({ error });
  }
}


// Get user function
export async function getUser(req, res) {
  const { email } = req.params;

  try {
    if (!email) return res.status(501).send({ error: "Email not found" });

    // Use await to wait for the findOne operation to complete
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).send({ error: "User not found" });

    // remove unnecessary data from the response with an object converting it to JSON
    const { password, ...rest } = Object.assign({}, user.toJSON());

    return res.status(200).send(rest);
  } catch (error) {
    res.status(500).send({ error });
  }
}



export async function updateUser(req, res){
    res.json('updateUser route');
}


export async function generateOTP(req, res){
    res.json('generateOTP route');
}


export async function verifyOTP(req, res){
    res.json('verifyOTP route');
}

export async function createResetSession(req, res){
    res.json('createResetSession route');
}

export async function resetPassword(req, res){
    res.json('resetPassword route');
}

