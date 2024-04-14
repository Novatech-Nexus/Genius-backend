import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { config } from 'dotenv';

config();

// https://ethereal.email/create
let nodeConfig = {
    
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
} 

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
    }
})

//controller
export const registerMail = async (req, res) => {
    const { userEmail, text, subject } = req.body;

    //body of the email
    var email = {
        body: {
            name: userEmail,
            intro: text || 'Welcome to Genius Restaurant! We are very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    //Pass the email to the MailGenerator
    var emailBody = MailGenerator.generate(email);
    
    let message = {
        from : process.env.EMAIL,
        to : userEmail,
        subject : subject || "Welcome to Genius Restaurant",
        html : emailBody
    }

    //send Mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg : "Email sent successfully" });
        })
        .catch(error => res.status(500).send({ error }))
}

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
 *  "userEmail": "",
 *  "text": "",
 *  "subject": ""
 * }
*/