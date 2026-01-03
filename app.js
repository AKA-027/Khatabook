require('dotenv').config();
const express = require('express') ;
const app = express() ;
const path = require('path') ;
const fs = require('fs');
const usermodel = require('./models/usermodel');
const hisaabModel = require('./models/hisaabModel') ;
const jwt = require('jsonwebtoken') ;
const bcrypt = require('bcrypt') ;
const cookieParser = require('cookie-parser') ;

app.set("view engine" , "ejs") ;
app.use(express.json()) ;
app.use(cookieParser()) ;
app.use(express.urlencoded({extended:true})) ;
app.use(express.static(path.join(__dirname, "public"))) ;


 function isLoggedIn(req,res,next){
     let token = req.cookies.token ;
     if(!token) return res.send("you must be logged in") ;

     let decoded = jwt.verify(token,"khatabook@123") ; 
     req.user = decoded ;
     next() ;
 }



app.get("/", (req, res) => {
    res.render("index");
});


app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup" ,async (req,res) => {
     const {firstName ,lastName,email,password,confirmPassword}  = req.body ;
   
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.send("All fields are required!");
    }

     if(password !== confirmPassword){
        return  res.send("Passwords do not match ! please try again") ;
     }

     const salt = await bcrypt.genSalt(10) ;
     const hash = await bcrypt.hash(password,salt) ;


     

     const user = await  usermodel.create({
          firstName,
          lastName,
          email,
          password:hash, 

          
     });
     res.send("sucessfully registered") ;     
})

app.get("/Login" ,(req,res) => {
       res.render("login") ;
} )

app.post("/login" , async (req,res) => {
     const {email,password} = req.body ;
     // 1. Check if ANY field is empty
    if (!email || !password) {
        return res.send("All fields are required!");
    }
     let user =  await usermodel.findOne({email:email}) ;
     if(!user){
        return res.send("user does not exists") ;
     }
     let token  = jwt.sign({email:user.email , id:user._id}  , "khatabook@123")  ;

     if(!user) return res.status(404).send("user does not exist") ;
             let match = await bcrypt.compare(password,user.password) ;
             if(match) {
               res.cookie("token" , token) ;
               res.send("successfully logged in and cookie set") ;
                
             }else{
             res.send("something went wrong") ; 
                
             }
             
    


}) ;
app.get("/profile" ,(req,res) => {
      // get the cookie
       let token = req.cookies.token;
       if(!token) {
          res.send("you are not logged in") ; 
       }
       // verify token
       let decoded = jwt.verify(token,"khatabook@123");
       console.log(decoded) ;
       res.send("welcome" + decoded.email) ;
}) 

app.get("/create" , (req,res) => {
     res.render("create") ;
}) ;

app.post("/createhisaab" ,isLoggedIn ,  async(req,res,next) => {
    const{title,content} = req.body ;
     const hisaab = await hisaabModel.create({
        title,
        content,
        user:req.user.id
         }) ; 
     let user = await usermodel.findOne({email:req.user.email}) ;
     user.hisaabs.push(hisaab._id) ;
     await user.save() ;

     res.redirect("/profile") ;
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports = app;