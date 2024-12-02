const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please add the user'],
    },
    email:{
        type:String,
        required:[true,'Please add the user email address'],
        unique:[true,'Email Address should be unique']
    },
    password:{
        type:String,
        required:[true,'Please add Password']
    },
},
{
    timestamps:true,
});

module.exports=mongoose.model("User",userSchema);