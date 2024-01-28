const JWT = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();
const User = require("../models/userModel.js")
const Community = require("../models/communityModel.js")
const Member = require("../models/memberModel.js")



const getResult = (status, total, pages, page, data) => {
    let result = {
        "status": status,
        "content": {
            "meta": {
                "total": total,
                "pages": pages,
                "page": page
            },
            "data": data
        }
    }
    return result
}

const createCommunity = async (request,response) =>{
    try{
        const bearerToken = request.headers["authorization"]
        const token = bearerToken && bearerToken.split(" ")[1];
        const SECRET_KEY = process.env.SECRET_KEY;
        let getUser;
        JWT.verify(token, SECRET_KEY, (error, user) => {
            if (error) {
                console.log("error",error)
            }
            getUser = user
        })
        const userData = await User.findOne({ email: getUser.email })
        const userId = userData.id;
        const data = {
            name: request.body.name,
            owner: userId
        }
        const newCommunity =  new Community(data);
        const result = await newCommunity.save();
        let res = {
            "status": "true",
            "content": {
                "data": {
                    "id": result.id,
                    "name": result.name,
                    "slug": result.slug,
                    "owner": result.owner,
                    "created_at": result.createdAt,
                    "updated_at": result.updatedAt
                }
            }
        }
        return response.status(200).json(res);
    }catch(error){
        console.log("errr",error)
        return response.status(400).json(error)
    }
    
}

const getAllCommunity = async (request,response) =>{
    try{
        let communities = await Community.find({},{_id:0,__v:0});
        const totalDocuments = communities.length;
        const totalPages = totalDocuments/10;
        const page=1;
        let result = getResult("true",totalDocuments,totalPages,page,communities)
        return response.status(200).json(result);
        // const populatedCommunities = [];

        // for (const community of communities) {
        //     const user = await User.find({ id: community.owner },{_id:0}).select('name id');
        //     console.log("user is ",user)
        //     const populatedCommunity = { ...community.toObject(), owner: user };
        //     populatedCommunities.push(populatedCommunity);
        // }
    }catch(error){
        console.log("error",error)
        return response.status(400).json(error);
    }
}

const getMyCommunity = async(request,response)=>{
    try{
        const bearerToken = request.headers["authorization"]
        const token = bearerToken && bearerToken.split(" ")[1];
        const SECRET_KEY = process.env.SECRET_KEY;
        let getUser;
        JWT.verify(token, SECRET_KEY, (error, user) => {
            if (error) {
                console.log("error",error)
                return;
            }
            getUser = user
        })
        const userData = await User.findOne({ email: getUser.email })
        const userId = userData.id;
        const myCommunities = await Community.find({owner:userId},{_id:0,__v:0});
        const totalCommunities = myCommunities.length;
        const totalPages = totalCommunities/10;
        let page=1;
        let result = getResult("true",totalCommunities,totalPages,page,myCommunities);
        return response.status(200).json(result);
    }catch(error){
        console.log("error",error);
        return response.status(200).json(error);
    }

}

const myJoinedCommunity = async (request,response) =>{
    try{
        const bearerToken = request.headers["authorization"]
        const token = bearerToken && bearerToken.split(" ")[1];
        const SECRET_KEY = process.env.SECRET_KEY;
        let getUser;
        JWT.verify(token, SECRET_KEY, (error, user) => {
            if (error) {
                console.log("error",error)
                return;
            }
            getUser = user
        })
        const userData = await User.findOne({ email: getUser.email })
        const userId = userData.id;

        const memberOfCommunities = await Member.find({user:userId},{community:1,_id:0});
        let communities =[]
        for(let i=0;i<memberOfCommunities.length;i++){

            communities.push(memberOfCommunities[i].community);
        }

        const getCommunities = await Community.find({id:{$in:communities}},{_id:0,__v:0})
        const totalCommunities=getCommunities.length;
        const totalPages = totalCommunities/10;
        const page=1;
        let result = getResult("true",totalCommunities,totalPages,page,getCommunities);
        return response.status(200).json(result);
    }catch(error){
        return response.status(400).json(error);
    }
}

const getCommunityMembers = async(request,response) => {
    try{

        const community = await Community.findOne({name:request.params.id},{_id:0,id:1})
        const communityId = community.id;
        const communityMembers = await Member.find({community:communityId},{_id:0,__v:0,updatedAt:0})
        const totalMembers = communityMembers.length;
        const totalPages = totalMembers/10;
        const page=1;
        let result = getResult("true",totalMembers,totalPages,page,communityMembers)
        return response.status(200).json(result);
    }catch(error){
        return response.status(400).json(error);
    }
}

module.exports = {
    createCommunity,
    getAllCommunity,
    getMyCommunity,
    myJoinedCommunity,
    getCommunityMembers
}