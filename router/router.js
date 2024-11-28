const express = require('express');
const router=express.Router();

const mycontroller= require('../controller/controller');

// router.get('/',mycontroller.ragistation);
router.post('/usr',mycontroller.createuser);
router.post('/results',mycontroller.showresult);
router.post('/usr-login',mycontroller.login);
router.get('/usr-get',mycontroller.getAllUsers);
router.post('/usr-update', mycontroller.updateUserEmail)
router.post('/usr-update-pass',mycontroller.upadatePassword);
router.post('/usr-delet',mycontroller.deletuser);
router.post("/",mycontroller.userget)

router.get('/api1',mycontroller.api1,mycontroller.api2);


router.post('/dummylogin',mycontroller.dummyLogin);
router.post('/checkOE',mycontroller.validatetoken,mycontroller.checkEvenOd);

module.exports=router