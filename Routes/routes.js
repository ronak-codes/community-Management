const express = require("express")
const router = express.Router();
const {signUpUser,signInUser,getUserDetails} = require("../controller/userController")
const { validateUserSignUp, validateUserSignIn, validateCommunity,validateCreateRole,validateAddMember,validateDeleteMember} = require("../middleware/validate.js")
const {createCommunity,getAllCommunity,getMyCommunity,myJoinedCommunity,getCommunityMembers} = require("../controller/communityController.js")
const {createRole,getAllRole} = require("../controller/roleController.js")
const {addMember,deleteMember} = require("../controller/memberController.js")

// user
router.post("/auth/signup",validateUserSignUp,signUpUser);
router.post("/auth/signin",validateUserSignIn,signInUser);
router.get("/auth/me",getUserDetails);

// community
router.post("/community",validateCommunity,createCommunity)
router.get("/community",getAllCommunity)
router.get("/community/me/owner",getMyCommunity)
router.get("/community/me/member",myJoinedCommunity)
router.get("/community/:id/members",getCommunityMembers)

// role
router.post("/role",validateCreateRole,createRole)
router.get("/role",getAllRole)

// member
router.post("/member",validateAddMember,addMember)
router.delete("/member/:id",validateDeleteMember,deleteMember)


module.exports = router;