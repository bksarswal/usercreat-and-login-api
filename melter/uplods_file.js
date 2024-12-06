const multer= require('multer');
// const uplode= multer({dest:'uplodes/'})


var storage = multer.diskStorage({destination:function(req,file,cb){


    cb(null,'uplodes');
},
filename:function(req,file,cb){

    req['file_name']=file.originalname;
   

    if (!/jpeg|jpg/.test(file.mimetype.split('/')[1])) {
        return cb(new Error('Only JPG files are allowed'));
    } else {
        cb(null, file.originalname);
    }
    

    
}

})

const uplode= multer({storage:storage});

module.exports= uplode;