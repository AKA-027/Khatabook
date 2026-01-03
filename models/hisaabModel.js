const mongoose = require('mongoose') ;

const hisaabSchema = mongoose.Schema({
    title:String,
    content:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    date:{
        type:Date,
        default: Date.now(),
    },
    encrypted:{
       type:Boolean,
       default:false
    },
   
    shareable:{
        type:Boolean,
        default:false
    }


}) ;

module.exports = mongoose.model("hisaab" , hisaabSchema) ;