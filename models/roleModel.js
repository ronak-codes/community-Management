const mongoose = require("mongoose")
const {Snowflake} = require("@theinternetfolks/snowflake");


const roleSchema = new mongoose.Schema({
    id:{
        type:String,
        default:() => Snowflake.generate(),
        unique:true
    },
    name:{
        type:String,
        required:true,
        minLength:2
    }
},{timestamps:true});


const Role = mongoose.model("role",roleSchema)

module.exports = Role;