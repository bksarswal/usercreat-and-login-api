
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

name : { type :String,
    required :true

},
email : {
    type : String,
    required : true,
     unique : true
}
,
phone : {

    type : String,
    required : true,
    unique : true
  
},

password : {
    type: String,
require:true
}



})

 const user = mongoose.model("user", userSchema);


 module.exports = user;