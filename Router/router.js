const express = require("express")
const route = express.Router();


const barchart = require("../controllers/BarChart")
const get3apidata = require("../controllers/Fetch")
const getfulldata = require("../controllers/Full")
const piechart = require("../controllers/PieChart")

const stats = require("../controllers/Stats")

console.log(typeof barchart);
console.log(typeof get3apidata);
console.log(typeof piechart);
console.log(typeof getfulldata);
console.log(typeof getsearcheddata);
console.log(typeof stats);

  
  route.get("/barchart",barchart)
  route.get("/get3apidata",get3apidata)
  route.get("/getfulldata",getfulldata)
  route.get("/piechart",piechart)
  route.get("/stats",stats)
  
  module.exports = route; 