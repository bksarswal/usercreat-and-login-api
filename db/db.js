const mongoose= require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/second');

const db= mongoose.connection;
db.on('err',()=>{

    console.log('somthing went rong');

    
})

db.once('open',()=>{

    console.log('mongodb is sucassfully conected');
    
})

module.exports=db;