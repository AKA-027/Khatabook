const mongoose = require('mongoose') ;

mongoose.connect(process.env.MONGODB_URL);
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