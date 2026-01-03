const mongoose = require('mongoose') ;

mongoose.connect("mongodb+srv://saxenasaumya027_db_user:msFghCicAWhSHvF8@cluster0.56rtucu.mongodb.net/?appName=Cluster0");
const db = mongoose.connection;

db.on("error" , function(err){
    console.log(err) ;
});

db.on("open" , function(){
    console.log("connected") ;
})

const userSchema = mongoose.Schema({
     firstName :String,
     lastName : String,
     email:String,
     password:String,
     confirmPassword:String,
     hisaabs:[
        {
           type: mongoose.Schema.Types.ObjectId,
           ref:"hisaab"
        }
        
     ]

}) ;

module.exports = mongoose.model("user" , userSchema) ;