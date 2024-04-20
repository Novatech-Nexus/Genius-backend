import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';

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
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
    console.log(user);
    return res.status(200).send({ msg: "Login successful", email: user.email, token, id: user._id});
  } catch (error) {
    return res.status(500).send({ error });
  }
}


// Get user function
export async function getUser(req, res) {
  const { email } = req.params;
  console.log({ email });


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

//Update user function
export async function updateUser(req, res) {
  
  try {

    const { email } = req.body;

    if (!req.headers.id) {
      return res.status(400).send({ error: "Missing id" });
    } else {
      const body = req.body;

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.headers.id },
        body,
        {
          new: true,
        }
      );

      if (!updatedUser) {
        return res.status(404).send({ error: "User not found" });
      } else {
        return res.status(200).send({ msg: "Record updated successfully" });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: error.message || "Internal server error" });
  }
}

//delete user function
export async function deleteUser(req, res){
  try {
    if (!req.headers.id) {
      return res.status(400).send({ error: "Missing id" });
    } else {
      const deletedUser = await UserModel.findOneAndDelete({ _id: req.headers.id });

      if (!deletedUser) {
        return res.status(404).send({ error: "User not found" });
      } else {
        return res.status(200).send({ msg: "Record deleted successfully" });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: error.message || "Internal server error" });
  }

}

//get all users
export async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find({}, '-password'); // Exclude password field from the response
    return res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error });
  }
}



//Generate OTP function
export async function generateOTP(req, res){
    req.app.locals.OTP = await otpGen();
    res.status(201).send({ code : req.app.locals.OTP });
  }

//Verify OTP function
export async function verifyOTP(req, res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
      req.app.locals.OTP = null;  //reset the OTP value
      req.app.locals.resetSession = true;  //start the session for reset password
      return res.status(201).send({ msg : "Verify Succesfully" });
    }
    else{
      return res.status(400).send({ error : "Invalid OTP" });
    }
}

//Reset session function
export async function createResetSession(req, res){
    if(req.app.locals.resetSession){
      return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error : "Session expired" })
}

//Reset password function
export async function resetPassword(req, res) {
  try {

    if(!res.app.locals.resetSession){
      return res.status(440).send({ error : "Session expired" })
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateResult = await UserModel.updateOne(
      { email: user.email },
      { password: hashedPassword }
    );

    if (updateResult.nModified == 0) {
      throw new Error("No document matches the provided query.");
    }

    return res.status(201).send({ msg: "Record updated" });

  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
