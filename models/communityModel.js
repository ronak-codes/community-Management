const mongoose = require("mongoose")
const slugify = require("slugify");
const {Snowflake} = require("@theinternetfolks/snowflake")

const communitySchema = new mongoose.Schema({
    id:{
        type:String,
        default:() => Snowflake.generate()
    },
    name:{
        type:String,
        required:true,
        minLength:2
    },
    slug:{
        type:String,
    },
    owner:{
        type:String,
        ref:'User',
        required:true,
    }
},{timestamps:true});

communitySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Community = mongoose.model("Community",communitySchema);

module.exports = Community;