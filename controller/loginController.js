// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// import barang
const barang = require('../model/loginModel')
// call express library
const app = express();
// call multer library
const multer = require('multer')
// Import the filesystem module
const fs = require('fs');
// information using ejs
app.set('view engine', 'ejs')
// use express static for public folder
app.use(express.static('public'))
// use express layout
app.use(expressLayouts);
// set default layout for all routing
app.set('layout', 'layouts/main');