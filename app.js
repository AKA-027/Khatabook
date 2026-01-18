require("dotenv").config() ;
const express = require("express") ;
const app = express() ;
const path = require("path") ;
const mongoose = require("mongoose") ;
const userModel = require("./models/user") ;
const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken") ;
const cookieParser = require("cookie-parser") ;

app.use(express.json()) ;
app.use(express.urlencoded({extended:true})) ;
app.use(express.static(path.join(__dirname , "public"))) ;
app.set("view engine" , "ejs") ;
app.use(cookieParser()) ;

mongoose.connect(process.env.MONGODB_URL) 
 .then( () =>{
    console.log("mongodb connected") 
 }

 )
 .catch((err) =>{
    console.log("connection error" , err) ;
 })




app.get("/" , (req,res) => {
    res.render("HomePage") ;
}) ;

app.get("/signup" , (req,res) => {
     res.render("signup") ;

}) ;

app.get("/login" , (req,res) => {
     res.render("login") ;
}) ;

app.post("/signupData" , async(req,res) => {
    const {firstName , lastName , email , password , confirmPassword} = req.body ;

    if(password !== confirmPassword){
      return res.send("passwords do not match") ;
    } 
    let existingUser = await userModel.findOne({email});

    if(existingUser){
       return res.send("user already exists , Please Login") ;
    }
   

   let salt = await bcrypt.genSalt(10) ;
   let hash = await bcrypt.hash(password,salt);


    let user = await userModel.create({
       firstName,
       lastName,
       email,
       password : hash
    }) ;
    
      res.redirect("/login") ;  


   
}) ;

app.post("/loginData" , async(req,res) => {
      const {email,password} = req.body ;
      let user = await userModel.findOne({email}) ;
      if(!user) {
         return res.send("user does not exist , please signup") ;
      }

      let token = await jwt.sign({email:email , id:user._id} , "shhhhhhhh") ;
        let cookie = res.cookie("token" , token) ;
        console.log(cookie) ;


      res.send("Successfully Logged in! check your browser cookies") ;


}) ;








app.listen(3000 , () => {
     console.log("port is listening on 3000") ;
}) ;
