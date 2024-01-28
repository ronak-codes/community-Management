const JWT = require("jsonwebtoken")
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
dotenv.config()
const User = require("../models/userModel.js")


const generateAccessToken = (userDetails) => {
    const access_token = JWT.sign(userDetails, process.env.SECRET_KEY, { expiresIn: '60m' });
    return access_token;
}

const errorMessage = (status="false",param,message,code) =>{
    let error ={
        "status":status,
        "errors":[
            {
                "param":param ?? delete error.errors[0].param,
                "message": message,
                "code":code
            }
        ]
    }
    if(!param){
        delete error.errors[0].param
    }
    if(!message){
        delete error.errors[0].message
    }
    if(!code){
        delete error.errors[0].code
    }
    return error;
}

const generateResult = (status="true",id,name,email,createdAt,token) =>{

    let result = {
        "status": status,
        "content": {
            "data":
            {
                "id": id,
                "name":name,
                "email": email,
                "created_at": createdAt,
            },
            "meta": {
                "access_token": token
            }
        }
    }
    if(!id){
        delete result.content.data.id;
    }
    if(!name){
        delete result.content.data.name;
    }
    if(!email){
        delete result.content.data.email;
    }
    if(!createdAt){
        delete result.content.data.created_at;
    }
    if(!token){
        delete result.content.meta;
    }
    return result;
}


const signUpUser = async (request, response) => {

    try {
        const hashedPassword = await bcrypt.hash(request.body.password,10);
        request.body = {...request.body,password:hashedPassword};
        const email = request.body.email;
        const isUserCreated = await User.findOne({email});
        if(isUserCreated){
            let error = errorMessage("false","email","User with this email address already exists.","RESOURCE_EXISTS")
            return response.status(400).json(error);
        }
        const userData = new User(request.body);
        let res = await userData.save();
        if (response) {
            const token = generateAccessToken({name:res.name,email:res.email})
            let result = generateResult("true",res.id,res.name,res.email,res.createdAt,token)
            return response.status(200).json(result);
        }

    } catch (error) {
        return response.status(400).json(error)
    }
}


const signInUser = async (request,response) =>{

    const email = request.body.email;
    const password = request.body.password;
    const userData = await User.findOne({email});
    if(!userData){
        let error = errorMessage("false","email","The credentials you provided are invalid.","INVALID_CREDENTIALS");
        return response.status(400).json(error);
    }

    try{
        const matchResult = await bcrypt.compare(password, userData.password)
        if (matchResult) {
            const token = generateAccessToken({ name: userData.name, email: userData.email })
            let result = generateResult("true",userData.id,userData.name,userData.email,userData.createdAt,token)
            return response.status(200).json(result);
    
        }else{

            let error=errorMessage("false","password","The credentials you provided are invalid.","INVALID_CREDENTIALS");
            return response.status(400).json(error);
        }

    } catch (error) {
        return response.status(400).json(error)
    }

}

const getUserDetails = async(request,response) =>{
    try{
        const bearerToken = request.headers["authorization"];
        const token = bearerToken && bearerToken.split(" ")[1];
        const SECRET_KEY=process.env.SECRET_KEY;
        let getUser;
        let errorMsg=errorMessage("false","","You need to sign in to proceed.","NOT_SIGNEDIN")
        JWT.verify(token,SECRET_KEY,(error,user)=>{
            if(error){
                return response.status(400).json(errorMsg);
            }
            getUser=user
        })
        const userData = await User.findOne({email:getUser.email});
        let result = generateResult("true",userData.id,userData.name,userData.email,userData.createdAt,"")
        return response.status(200).json(result);
    }catch(error){
        console.log("error is",error)
        return response.status(200).json(error);
    }
}


module.exports = {
    signUpUser,
    signInUser,
    getUserDetails
}