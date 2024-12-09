
const nodemailer= require('nodemailer');
const trapoter= nodemailer.createTransport({

    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"bholusaini686@gmail.com",
        pass:'miyv cvrg bnme ufyl'
    }
})









async function sendMail(to,otp){
    try{

        const mailOption ={

            from:"bholusaini686@gmail.com",
            to,
            sub:"send text",
            text: `ganrate otp is :${otp}`
        
        }
        
        const info = await trapoter.sendMail(mailOption);
        console.log("Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw the error for upper-level handling
    }

}

module.exports=sendMail;