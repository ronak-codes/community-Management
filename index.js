const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser");
const Router  = require('./Routes/routes.js')
const Connection = require("./database/connection.js")
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const USERNAME = process.env.DATABASE_USERNAME;
const PASSWORD = process.env.DATABASE_PASSWORD;

app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));

app.use("/v1",Router)


app.listen(PORT ,() => {
    console.log(`Server is running at port number ${PORT}`);
});

Connection(USERNAME,PASSWORD);