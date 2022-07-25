// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// call express library
const app = express();
// call express validator
// const {body,validationResult,check} = require('express-validator')
const bodyParser = require('body-parser');
// call function from barang controller
const { listBarang, newBarang, addBarangView, detailBarang, updateBarangView, updateBarangSend, deleteBarang } = require("./controller/barangController");
// call function from supplier controller
const { listSupp, addSuppView, newSupp, detailSupp, updateSuppView, updateSuppSend, deleteSupp } = require("./controller/suppController");
// call function from distributor controller
const { listDistri, addDistriView, newDistri, detailDistri, updateDistriView, updateDistriSend, deleteDistri } = require("./controller/distriController");
// call function from user controller
const { listUser, addUserView, newUser, detailUser, updateUserView, updateUserSend, deleteUser } = require("./controller/userController");
const { listTrans, addTransView, newTrans, detailTrans, deleteTrans } = require("./controller/transController");
// call multer library
const multer = require('multer')

app.use(bodyParser.json()) // => req.body
app.use(bodyParser.urlencoded({extended:true}))

// setting port
const port = 3000;

// handle storage image path.extname(file.originalname)
const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './public/images/')
    },
    filename : (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

// handle filter image type
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') 
    {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: fileStorage, filter: fileFilter})

// call server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

// information using ejs
app.set('view engine', 'ejs')

// use express static for public folder
app.use(express.static('public'))

// use express layout
app.use(expressLayouts);
// set default layout for all routing
app.set('layout', 'layouts/main');

// login page
// app.get("/", (req,res) => {
//     res.render('login', {
//         title : "Login",
//         layout : "layouts/loginLayout"
//     })
// })

app.get("/", (req,res) => {
    res.render('login', {
        title : "Login",
        layout : "layouts/loginLayout"
    })
})

// barang routes
// list barang
app.get('/barang', listBarang);
// add barang form
app.get('/addBarang-form', addBarangView)
// add barang post
app.post('/addBarang',upload.array('image',1), newBarang)
// detail barang
app.get('/detailBarang/:idBarang/:nama', detailBarang)
// update detail barang
app.post('/updateBarangDetail-form', updateBarangView)
// update detail barang post
app.post('/updateBarangDetail', updateBarangSend)
// delete barang
app.post('/deleteBarang', deleteBarang)

// supplier routes
// list supp
app.get('/supplier', listSupp)
// add supp form
app.get('/addSupp-form', addSuppView)
// add supp post
app.post('/addSupp', newSupp)
// detail supp
app.get('/detailSupp/:idSupp/:nama_toko', detailSupp)
// update detail supp
app.post('/updateSuppDetail-form', updateSuppView)
// update detail supp post
app.post('/updateSuppDetail', updateSuppSend)
// delete supp
app.post('/deleteSupp', deleteSupp)

// distributor routes
// list distri
app.get('/distributor', listDistri)
// add distri form
app.get('/addDistri-form', addDistriView)
// add distri post
app.post('/addDistri', newDistri)
// detail distri
app.get('/detailDistri/:idDistri/:nama_toko', detailDistri)
// update detail distri
app.post('/updateDistriDetail-form', updateDistriView)
// update detail distri post
app.post('/updateDistriDetail', updateDistriSend)
// delete distri
app.post('/deleteDistri', deleteDistri)

// user routes
// list user
app.get('/user', listUser)
// add user from
app.get('/addUser-form', addUserView)
// add user post
app.post('/addUser', newUser)
// detail user
app.get('/detailUser/:idUser/:username', detailUser)
// update detail user
app.post('/updateUserDetail-form', updateUserView)
// update detail user post
app.post('/updateUserDetail', updateUserSend)
// delete user
app.post('/deleteUser', deleteUser)

// transaksi routes
// list transaksi
app.get('/transaksi', listTrans)
// add transaksi form
app.get('/addTrans-form', addTransView)
// add transaksi post
app.post('/addTransaksi', newTrans)
// detail transaksi
app.get('/detailTransaksi/:idTrans', detailTrans)
// delete transaksi
app.post('/deleteTrans', deleteTrans)
























