const express = require('express');
const Transaction = require('../models/Transaction'); // Update the path accordingly
const router = express.Router();
const axios = require("axios")

 const getfulldata = async (req, res,next) => {
  try {
      
     const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");

      res.status(200).json({
          success: true,
          data: response.data,
         
          
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Error fetching data',
          error: error.message
      });
  }
 };

module.exports = getfulldata;