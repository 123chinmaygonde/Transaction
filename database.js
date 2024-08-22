const mongoose= require("mongoose")
require("dotenv").config();

const URL = "mongodb://127.0.0.1:27017/NewprojectTransactions"
const dbconnect =()=> mongoose.connect(URL).then(()=>{
    console.log("database connected successfully");
}).catch((error)=>{
    console.log("error while connecting Database", error);
})
module.exports = dbconnect