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
    user: "blanche32@ethereal.email",
    pass: "SBpN9MRyYnCBgdCdvk",
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

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
 *  "email": "",
 *  "text": "",
 *  "subject": ""
 * }
*/

//controller
export const registerMail = async (req, res) => {
    const { email, text, subject } = req.body;

    //body of the email
    var Email = {
        body: {
            name: email,
            intro: text || 'Welcome to Genius Restaurant! We are very excited to have you on board.',
            outro: 'Visit us from here : `genius-frontend.vercel.app` Need help, or have questions? Just reply to this email, we\'d love to help.'
        } 
    }

    //Pass the email to the MailGenerator
    var emailBody = MailGenerator.generate(Email);
    
    let message = {
        from : "blanche32@ethereal.email",
        to : email,
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

