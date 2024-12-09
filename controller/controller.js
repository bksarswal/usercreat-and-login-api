const schema= require('../schema/schema');
const bcrypt = require('bcrypt');
const jwt= require("jsonwebtoken");
const privatkey = "sikretkey";




const mailschema = require('../schema/mailschema');
const sendMail= require('../mailer/mailer');

exports.ragistation= (req,res)=>{


    res.send(` 
        <html>
        <head><title>form</title></head>
        <body><form method="POST" action="/results"> 
        <input name="n1" placeholder="enter your name">
        <input name="n2" placeholder="enter your name">
        <button>submit</button>

        </form> </body>
        
        
        <html>`)
};

exports.showresult=(req,res)=>{


    console.log(req.body.n1);
    console.log(req.body.n2);

    res.send('hi');
}

exports.createuser= (req,res)=>{


    const { name , email, phone,password}=   req.body;



    if(!password){

        res.status(409).send({status:409,message:"password is required"})
    }
    else{


        bcrypt.genSalt(10, function(err,salt){


            if (err)
        {
        
        
            res.status(400).send({status:400,message:"some tihng went rong"});
        }
        else{
        
        
        bcrypt.hash(password,salt,function(err,hash){
        
        
            if( err){
        
                res.status(500).send({status:500,message:'somthing went rong '})
            }
            else {
        
                  schema.insertMany( {  name: name , email:email,phone:phone ,password:hash }).then((result)=>{
             res.status(200).send({status:200,message:"usr creaste successfully"});
        // res.redirect('/')
        
        }).catch((err)=>{
        
            
        
             if (err.name=='ValidationError'){
                   res.send( {message : `${err.message.split(':')[1]} is not bi empty`})
        
        
             }
             else if( err.name=='MongoBulkWriteError'){
        
          let key = err.message.split(":")[3].replace("{", "").trim();
          let value = err.message.split(":")[4].replace("}","").trim();
        
        
                res.send({message:`user, ${key} allready exit with ${value}`})
             }
        
        else{
        
            res.send("something went rong ");
            
        }
        
          
        })
        
            }
        })
        
        
        }
        
            })
        
    }

}


exports.login  = (req,res)=>{

    const {email,password}= req.body;
    if(!email || !password){

        res.status(401).send({status:401, message:"email and password is required"})
    }
    else{



        schema.find({email:email}).then((result)=>{

   bcrypt.compare(password,result[0].password,function(err,auth){

if(err){

    res.status(500).send({status:500,message:"somethng went rong"})
}
else{

if(auth==true){

    const {id,name, email, mobile}=result[0];

    res.status(200).send({status:200,message:"user login  successfully" ,data:{_id:id,name:name,email:email,mobile:mobile}} )
}
else{


    res.status(401).send({status:401,message:"password is incorrect  try again"})
}


}
    })

        }).catch((err)=>{
    
    
            res.status(401).send({status:401,message:"usr not found"})
        })
    
    }

   






}


exports.getAllUsers= (req,res)=>{


schema.find({}).then((result)=>{

    res.status(200).send(result)
}).catch((err)=>{


    res.status(404).send({status:404,message:"something went rong"});

})


}



exports.updateUserEmail = (req,res)=>{


    const {id, email}= req.body;

    schema.updateOne({_id:id},{$set:{email:email}}).then((result)=>{
         console.log(result)

         if(result.matchedCount== 1){


            res.status(200).send({status:200,message:"usr update successfully"});
         }
         else{


            res.status(404).send({status:404,message:'resourcer not found '})
         }
        res.send("hi");
    }).catch((err)=>{

        res.status(500).send({status:500,message:"something went rong"});

    })
}

exports.upadatePassword = (req,res)=>{

    const {id,o_pass,n_pass,c_pass}=req.body;



    if(n_pass !== c_pass){


        res.status(400).send({status:400,message:"npass and cpass does not match"})
    }
    else{


        schema.find({_id:id}).then((result)=>{
 
            
          bcrypt.compare(o_pass,result[0].password,function(err,auth){


            if(err){

                res.status(404).send({status:404,message:"something went rong"});
            }
            else{

             if(auth==false){

                res.status(400).send({status:400,message:"Old pass is didn't match"})
             }
             else{

              bcrypt.genSalt(10,function(err,salt){

             if(err){

                res.status(404).send({status:404,message:"something went rong"});
             }
             else{

                bcrypt.hash(n_pass,salt,function(err,hash){


                    if(err){
                        res.status(404).send({status:404,message:"something went rong"});

                    }
                    else{
                      

                        console.log(hash)
                        schema.updateOne({_id:id  } , {  $set:{password:hash}}).then((resp)=>{

                            console.log(resp);

                            if(resp.matchedCount== 1){
                   
                   
                               res.status(200).send({status:200,message:" usr update successfully"});
                            }
                            else{
                   
                   
                               res.status(404).send({status:404,message:'resourcer not found '})
                            }
                           
                       }).catch((err)=>{
                   
                           res.status(500).send({status:500,message:"something went rong"});
                   
                       })
                      
                    }
                })
             }


              })


             }

            }

          })

           
        }).catch((err)=>{
            res.status(404).send({status:404,message:"something went rong"});
        })
    }
}


exports.restpassbyotp= (req,res)=>{



    let otp=Math.floor(Math.random()*9000)+1000;

    const {email}=req.body;
    schema.find({email:email}).then((result)=>
        {  
        if(result.length==0){

            res.status(400).send({status:200,message:"user note found"})
        }
        else{

            console.log('yahse-0');
          
          
            console.log('yahse1');
            mailschema.insertMany({id:result[0].id ,otp:otp}).then(()=>{
            res.status(200).send({status:200,message:"otp save successfully"})
        
            }).catch((err)=>{
           
                res.send('soemthong went rong')
            });
            sendMail(result[0].email, otp);
        }
    }).catch((err)=>{
        console.log('yahse3');
        res.send('soemthong went rong')
    })
}

exports.deletuser=(req,res)=>{


    const {id}=req.body;

    schema.deleteOne({id:id}).then((result)=>{
        console.log(result);
        res.send("hi")
    }).catch((err)=>{


        res.status(404).send({status:404,message:"some thing went rong"})
    })
}


exports.userget=(req,res)=>{



schema.find({}).then((result)=>{
    console.log(result)
var temp = "n";


for(let i=0;i<result.length;i++){

  temp=temp+`

    <tr>
        <td>${i+1}</td>
        <td>${result[i].name}</td>
        <td>${result[i].email}</td>
        <td>${result[i].phone}</td>
        
    </tr>`
}


    res.send(`
        
<html lang="en">
<head>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
    <title>form</title>
</head>
<body>


    <form method="post" action="/usr">
         
      
        <input  name="name"  placeholder="enter your name ">;
        <input  name="email"  placeholder="enter your email ">;
        <input  name="phone"  placeholder="enter your phole ">;
        <input  name="password"  placeholder="enter your password ">;
        <button>submit</button>
    </form>

    <table><tr>
        <td>sN</td>
        <td>NAME</td>
        <td>EMAIL</td>
        <td>PHONE</td>
       
    </tr>
    ${temp};

</table>
</body>
</html>
        `)


    
}).catch((err)=>{
    console.log("err");
})

}


exports.api1=(req, res,next)=>{

   let number = parseInt(req.query.num);
   console.log(req.query.num);

    if(number % 2 !==0){

        res.send('number should be even');

}
else{

    
    req.v_num= number;
    next()   
}

}


exports.api2= (req,res)=>{

 console.log(req.v_num);


 res.send('this is even number')

     


}



exports.dummyLogin=(req,res)=>{

    const user= {

        name :"ram",
        email:"ram@gmail.com",
        mobile:"12312397933",
        password:"12345"
    };


  var token=  jwt.sign({email:user.email},privatkey,{expiresIn:"300s"})

  user['token']=token;
  res.send(user);
       
};




exports.validatetoken=(req,res,next)=>{

    const {token}=req.body;


    jwt.verify(token,privatkey,function(err,auth){
 
        if(err){

            if(err.name=='TokenExpiredError'){

                res.send("token has been expired")
            }
           
            else if(err.name=='JsonWebTokenError'){
                res.send("in valid toke ");
            }
            
          else{

            res.status(500).send({status:500,message:'someting went rong'})
          }
        }
        else
        {
            
            if(auth.email=="ram@gmail.com"){

             req.v_status=true;
             next()


            }
     else{

        res.send("invalid  token")
     }
        }
    })


}

exports.checkEvenOd = (req,res)=>{


    let number= parseInt(req.body.num);

    if(number %2==0){
        res.send("enen number");


    }
    else{

        res.send("odd number"); 
    }
}
   

exports.uplodeimage= (req,res)=>{

const {id}= req.body;
console.log(req.files);
  
    schema.find({id:id}).then((result)=>{
        console.log(result);
        if(result.length==0){

            res.send('user not found')
        }
        else{

            const {profile_pic}=result[0];
           
            const static= `http://localhost:9999/static/${req.file_name}`
            schema.updateOne({id:id}, { $set:{profile_pic:static}}).then((u_result)=>{

                if(u_result.matchedCount==1){

                    console.log(result);

                    console.log(u_result);
                    res.send('successfully update');
                }
                else{
                    res.send('not update')
                
                }
            }).catch((err)=>{
                res.send('something went rong')
            })
        }

    }).catch((err)=>{

res.send('somethong went rong')
    })
}

