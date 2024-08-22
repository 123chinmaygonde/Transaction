const express=  require("express")
const cookie = require("cookie-parser")
const app = express();
const dbconnect = require("./database")
const urlencoded = express.urlencoded

const route = require("./Router/router")
const cors = require("cors")

require("dotenv").config();

const PORT = process.env.PORT || 3000
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3001",
    credentials:true,

}))
dbconnect();
app.use(urlencoded({extended:true}))
app.use(cookie())

app.listen(PORT,()=>{
    console.log(`server live at ${PORT}`);
})
app.use("/api",route)
app.get("/" ,(req,res)=>[
    res.status(200).json({
        successs:true,
        message:"Hello there "
    })
])