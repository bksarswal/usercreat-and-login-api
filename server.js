const express= require('express');
const app = express();
const PORT = 9999;

const bodyParser = require('body-parser')
const myrouter = require('./router/router');
const mongoose= require('./db/db');
const schema= require('./schema/schema');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/',myrouter);






app.listen(PORT, ()=>{


    console.log('the server is start 9999');

})