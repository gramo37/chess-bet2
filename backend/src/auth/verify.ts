import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";


export async function EmailVerification(email:string) {
const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
        },
})

const token = jwt.sign({
        data: email  
    }, 'ourSecretKey', { expiresIn: '10m' }  
);    

const mailConfigurations = {

    // It should be a string of sender/server email
    from:`${process.env.EMAIL_USERNAME} <no-reply@chessbet.com>`,

    to: email,

    // Subject of Email
    subject: 'Email Verification',
    
    // This would be the text of email body
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:5000/api/auth/verify/${token}

           Thanks`
};

await transporter.sendMail(mailConfigurations, function(error, info){
    if (error) console.log(error);
    console.log('Email Sent Successfully');
    console.log(info);
});

}

