const mongoose= require('mongoose');
const mailschema= new mongoose.Schema({


    id:{
        type:String,
        required:true,
    },

    otp:{
        type:String,
        required:true,
        unique:true
    }
})
const usermail= mongoose.model("mailtable",mailschema);

module.exports=usermail;