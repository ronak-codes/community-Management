const Joi = require("joi")


const userSignUp = Joi.object({
    name:Joi.string().min(2).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
})

const userSignIn = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
})

const createCommunity = Joi.object({
    name:Joi.string().min(2).required()
})


const createRole = Joi.object({
    name:Joi.string().valid("Community Admin","Community Member","Community Moderator").required()
})

const addMember = Joi.object({
    community:Joi.string().length(19).required(),
    user:Joi.string().length(19).required(),
    role:Joi.string().length(19).required()
})

const deleteMember = Joi.object({
    id:Joi.string().length(19).required()   
})



module.exports = {
    userSignUp,
    userSignIn,
    createCommunity,
    createRole,
    addMember,
    deleteMember
}