const Role = require("../models/roleModel.js")

const createRole  = async (request,response) =>{
    try{

        const newRole = new Role(request.body);
        const res = await newRole.save();
        let result = {
            "status":"true",
            "content":{
                "data":{
                    "id":res.id,
                    "name":res.name,
                    "created_at":res.createdAt,
                    "updated_at":res.updatedAt
                }
            }
        }
        return response.status(200).json(result);
    }catch(error){
        console.log("errror ",error);
        return response.status(400).json(error);
    }
}

const getAllRole = async(request,response) =>{
    try{
        const res = await Role.find({},{_id:0,__v:0});
        const totalRole = res.length;
        const totalPages = totalRole/10;
        const page=1;
        let result = {
            "status":"true",
            "content":{
                "meta":{
                    "total":totalRole,
                    "pages":totalPages,
                    "page":page,
                },
                "data":res
            }
        }

        return response.status(200).json(result);


    }catch(error){
        console.log("getRole",error);
        return response.status(400).json(error);

    }
}

module.exports = {
    createRole,
    getAllRole
}