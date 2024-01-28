const mongoose = require("mongoose")
const {Snowflake} = require("@theinternetfolks/snowflake");

const memberSchema = new mongoose.Schema({
    id:{
        type:String,
        default: () => Snowflake.generate()
    },
    community:{
        type:String,
        ref:"Community",
        required:true
    },
    user:{
        type:String,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        ref:"Role",
        required:true
    }

},{timestamps:true});

const Member = mongoose.model("member",memberSchema);

module.exports = Member
