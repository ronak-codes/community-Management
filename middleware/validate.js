const { userSignUp,userSignIn,createCommunity,createRole,addMember,deleteMember} = require("./inputFormat.js")


const validateUserSignUp =  (request,response,next) => {

    const {error,value} = userSignUp.validate(request.body);
    if(error){
        let result = {
            "status":"false",
            "errors":[
                {
                    "param":error.details[0].path[0],
                    "message":error.details[0].message,
                    "code":"INVALID_INPUT"
                }
            ],
        }

        return response.status(400).json(result)
    }
    next();
} 

const validateUserSignIn = (request,response,next) =>{

    const {error,value} = userSignIn.validate(request.body);
    if(error){

        let result = {
            "status":"false",
            "errors":[
                {
                    "param":error.details[0].path[0],
                    "message":error.details[0].message,
                    "code":"INVALID_INPUT"
                }
            ],
        }
        return response.status(400).json(result)
    }
    next();

}

const validateCommunity =  (request,response,next) =>{

    const {error,value} = createCommunity.validate(request.body);
    if(error){
        let result = {
            "status": "false",
            "errors": [
                {
                    "param": error.details[0].path[0],
                    "message": error.details[0].message,
                    "code": "INVALID_INPUT"
                }
            ],
        }
        return response.status(400).json(result)
    }
    next();
}

const validateCreateRole = (request,response,next) => {

    const {error,value} = createRole.validate(request.body);
    if(error){
        let result = {
            "status": "false",
            "errors": [
                {
                    "param": error.details[0].path[0],
                    "message": error.details[0].message,
                    "code": "INVALID_INPUT"
                }
            ],
        }
        return response.status(400).json(result);
    }
    next();
}

const validateAddMember = (request,response,next) =>{
    const {error,value} = addMember.validate(request.body);
    if(error){
        // let result = {
        //     "status": "false",
        //     "errors": [
        //         {
        //             "param": error.details[0].path[0],
        //             "message": error.details[0].message,
        //             "code": "INVALID_INPUT"
        //         }
        //     ],
        // }
        return response.status(400).json(error);

    }
    next();
}

const validateDeleteMember = (request,response,next) =>{
    const {error,value} = deleteMember.validate(request.params)
    if(error){
        return response.status(400).json(error);
    }
    next();

}

module.exports = {
    validateUserSignUp,
    validateUserSignIn,
    validateCommunity,
    validateCreateRole,
    validateAddMember,
    validateDeleteMember
}