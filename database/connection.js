const mongoose = require("mongoose")
mongoose.set("strictQuery",true);

// create Database Connection

const Connection  = async (USERNAME,PASSWORD) => {
    USERNAME=encodeURIComponent(USERNAME);
    PASSWORD=encodeURIComponent(PASSWORD);

    const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@blogapp.ntkg8ag.mongodb.net/theInternetFolks?retryWrites=true&w=majority`
    try{
         await mongoose.connect(URL)

    }catch(error){
        console.log("error is",error)
    }
}


module.exports  = Connection