const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()
const Member = require("../models/memberModel.js")
const User = require("../models/userModel.js")
const Community  = require("../models/communityModel.js")
const Role = require("../models/roleModel.js")

const addMember = async (request,response) =>{
    try{
        const bearerToken = request.headers["authorization"];
        const token = bearerToken && bearerToken.split(" ")[1];
        const SECRET_KEY = process.env.SECRET_KEY;
        let getUser;
        JWT.verify(token,SECRET_KEY,(error,user)=>{
            if(error){
                return;
            }
            getUser = user;
        })

        const userData = await User.findOne({email:getUser.email});
        const userId = userData.id;
        let error = {
            "status":"false",
            "errors":[
                {
                    "param":"",
                    "message":"",
                    "code":"RESOURCE_NOT_FOUND",
                }
            ]
        }
        const community = await Community.findOne({id:request.body.community})
        if(!community){
            // no community found error
            error.errors[0].param="Community";
            error.errors[0].message="Community not found.";
            error.errors[0].code="RESOURCE_NOT_FOUND";
            return response.status(400).json(error)
        }
        if(community.owner!==userId){
            // not authorised to perform action
            delete error.errors[0].param;
            error.errors[0].message="You are not authorized to perform this action.";
            error.errors[0].code="NOT_ALLOWED_ACCESS";
            return response.status(400).json(error);
        }

        const role = await Role.findOne({id:request.body.role})
        if(!role){

            error.errors[0].param="role";
            error.errors[0].message="Role not found.";
            error.errors[0].code= "RESOURCE_NOT_FOUND";
            return response.status(400).json(error)
            // role not found error
        }
        const usertoAdd = await User.findOne({id:request.body.user});

        if(!usertoAdd){
            // user not found
            error.errors[0].param="user";
            error.errors[0].message="User not found.";
            error.errors[0].code= "RESOURCE_NOT_FOUND";
            return response.status(400).json(error)
        }

        const isMemberAdded = await Member.findOne({community:request.body.community,user:request.body.user});
        if(isMemberAdded){
            // user already added
            delete error.errors[0].param;
            error.errors[0].message="User is already added in the community.";
            error.errors[0].code= "RESOURCE_EXIST";
            return response.status(400).json(error);
        }

        const newMember = new Member(request.body);
        const res = await newMember.save();
        let result = {
            "status":"true",
            "content":{
                "data":{
                    "id":res.id,
                    "community":res.community,
                    "user":res.user,
                    "role":res.role,
                    "created_at":res.createdAt
                }
            }
        }

        return response.status(200).json(result);

    }catch(error){
        console.log("err",error)
        return response.status(400).json(error);
    }
}

const deleteMember = async (request,response) => {
    try{
        const bearerToken = request.headers["authorization"];
        const token = bearerToken && bearerToken.split(" ")[1];
        const SECRET_KEY = process.env.SECRET_KEY;
        let getUser;
        JWT.verify(token,SECRET_KEY,(error,user)=>{
            if(error){
                return;
            }
            getUser = user;
        })

        let error = {
            "status":"false",
            "errors":[
                {
                    "message":"",
                    "code":"",
                }
            ]
        }

        const userData = await User.findOne({email:getUser.email});
        const userId = userData.id;
        const member = await Member.findOne({id:request.params.id})
        if(!member){

            error.errors[0].message="Member not found.",
            error.errors[0].code="RESOURCE_NOT_FOUND";
            return response.status(400).json(error);
        }
        const memberCommunity = member.community;
        const community = await Community.findOne({id:memberCommunity})
        const communityOwner  = community.owner;

        if(communityOwner !== userId){
            error.errors[0].message= "You are not authorized to perform this action.",
            error.errors[0].code= "NOT_ALLOWED_ACCESS"
            return response.status(400).json(error);
        }
        const res = await Member.deleteOne({id:request.params.id})
        return response.status(200).json({"status":"true"})

    }catch(error){
        console.log("delete errro",error);
        return response.status(400).json(error)
    }

}

module.exports ={
    addMember,
    deleteMember
}