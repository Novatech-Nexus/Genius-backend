import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { config } from 'dotenv';

config();

// https://ethereal.email/create
let nodeConfig = {
  service: "Gmail",
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
export const supplierMail = async (req, res) => {
    const { email } = req.body;
    console.log("Request Body:", req.body);

    //body of the email
    var Email = {
        body: {
            name: email,
            intro: 'Welcome to Genius Restaurant!',
            outro: `Dear Supplier,Our inventory levels are dwindling fast!🚨  We need your help to restock urgently.Certain items are running dangerously low, which could impact our ability to fulfill orders and meet customer expectations. Your swift action in replenishing these items is crucial.`
        } 
    }

    //Pass the email to the MailGenerator
   
    var emailBody = MailGenerator.generate(Email);
    let message = {
        from : process.env.EMAIL,
        to : email,
        subject :"Welcome to Genius Restaurant",
        html : emailBody
    }

    //send Mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg : "Email sent successfully" });
        })
        .catch(error => res.status(500).send({ error }))
}