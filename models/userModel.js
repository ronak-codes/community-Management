const mongoose  = require("mongoose")
const { Snowflake } = require("@theinternetfolks/snowflake");


const userSchema  =  new mongoose.Schema({
    id:{
        type:String,
        default:() => Snowflake.generate(),
        unique:true,
    },
    name:{
        type:String,
        required:true,
        minLength:2,
        default:null,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    }

},{timestamps:true});

const User = mongoose.model("User",userSchema);

module.exports = User