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
const { listBarang, newBarang, addBarangView, detailBarang, updateBarangView, updateBarangSend, deleteBarang, addKategori } = require("./controller/barangController");
// call function from supplier controller
const { listSupp, addSuppView, newSupp, detailSupp, updateSuppView, updateSuppSend, deleteSupp } = require("./controller/suppController");
// call function from distributor controller
const { listDistri, addDistriView, newDistri, detailDistri, updateDistriView, updateDistriSend, deleteDistri } = require("./controller/distriController");
// call function from user controller
const { listUser, addUserView, newUser, detailUser, updateUserView, updateUserSend, deleteUser, resetPassword, myProfileView, editProfile } = require("./controller/userController");
// call function from transaksi controller
const { listTrans, addTransView, newTrans, detailTrans, deleteTrans } = require("./controller/transController");
// call function from logger controller
// call multer library
const multer = require('multer')
// call morgan
const morgan = require('morgan')
// call bcrypt library
const bcrypt = require('bcrypt')
// call session library
const session = require('express-session')
// call flash library
const flash = require('express-flash')
// call passport library
const passport = require("passport")
// call initialized function from passportConfig
const initializePassport = require("./utils/passportConfig");
const { logger, listLogger } = require("./controller/loggerController");

initializePassport(passport)

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

app.use(session({
    secret: "secret",

    resave: false,

    saveUninitialized: false,
}))


app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', logger)

app.get("/", checkAuthenticated, (req,res) => {
    res.render('login', {
        title : "Login",
        layout : "layouts/loginLayout"
    })
})

app.post("/", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true
}))

app.get("/home", checkNotAuthenticated, isStatus, (req,res) => {
    res.render('home', {
        title: "Home",
        user: req.user,
    })
})

// barang routes
// list barang
app.get('/barang', checkNotAuthenticated, listBarang);
// add barang form
app.get('/addBarang-form', checkNotAuthenticated, addBarangView)
// add barang post
app.post('/addBarang', checkNotAuthenticated, upload.array('image',1), newBarang)
// detail barang
app.get('/detailBarang/:idBarang/:nama', checkNotAuthenticated, detailBarang)
// update detail barang
app.post('/updateBarangDetail-form', checkNotAuthenticated, updateBarangView)
// update detail barang post
app.post('/updateBarangDetail', checkNotAuthenticated, upload.array('image',1), updateBarangSend)
// delete barang
app.post('/deleteBarang', checkNotAuthenticated, deleteBarang)
// add category barang
app.post('/addKategori', checkNotAuthenticated, addKategori);


// supplier routes
// list supp
app.get('/supplier', checkNotAuthenticated, listSupp)
// add supp form
app.get('/addSupp-form', checkNotAuthenticated, addSuppView)
// add supp post
app.post('/addSupp', checkNotAuthenticated, newSupp)
// detail supp
app.get('/detailSupp/:idSupp/:nama_toko', checkNotAuthenticated, detailSupp)
// update detail supp
app.post('/updateSuppDetail-form', checkNotAuthenticated, updateSuppView)
// update detail supp post
app.post('/updateSuppDetail', checkNotAuthenticated, updateSuppSend)
// delete supp
app.post('/deleteSupp', checkNotAuthenticated, deleteSupp)

// distributor routes
// list distri
app.get('/distributor', checkNotAuthenticated, listDistri)
// add distri form
app.get('/addDistri-form', checkNotAuthenticated, addDistriView)
// add distri post
app.post('/addDistri', checkNotAuthenticated, newDistri)
// detail distri
app.get('/detailDistri/:idDistri/:nama_toko', checkNotAuthenticated, detailDistri)
// update detail distri
app.post('/updateDistriDetail-form', checkNotAuthenticated, updateDistriView)
// update detail distri post
app.post('/updateDistriDetail', checkNotAuthenticated, updateDistriSend)
// delete distri
app.post('/deleteDistri', checkNotAuthenticated, deleteDistri)

// user routes
// list user
app.get('/user', checkNotAuthenticated, isAdmin, listUser)
// add user from
app.get('/addUser-form', checkNotAuthenticated, addUserView)
// add user post
app.post('/addUser', checkNotAuthenticated, newUser)
// detail user
app.get('/detailUser/:idUser/:username', checkNotAuthenticated, detailUser)
// update detail user
app.post('/updateUserDetail-form', checkNotAuthenticated, updateUserView)
// update detail user post
app.post('/updateUserDetail',checkNotAuthenticated, updateUserSend)
// delete user
app.post('/deleteUser', checkNotAuthenticated, deleteUser)
// reset password user
app.post('/resetPassword', checkNotAuthenticated, resetPassword)
// my-profile routing
app.get('/myProfile',checkNotAuthenticated, myProfileView)
// edit-profile post
app.post('/editProfile',checkNotAuthenticated, upload.array('image',1), editProfile)



// transaksi routes
// list transaksi
app.get('/transaksi', checkNotAuthenticated, listTrans)
// add transaksi form
app.get('/addTrans-form', checkNotAuthenticated, addTransView)
// add transaksi post
app.post('/addTransaksi', checkNotAuthenticated, newTrans)
// detail transaksi
app.get('/detailTransaksi/:idTrans', checkNotAuthenticated, detailTrans)
// delete transaksi
app.post('/deleteTrans', checkNotAuthenticated, deleteTrans)



// log routing
app.get('/log',checkNotAuthenticated, isAdmin, listLogger)


// logout
app.get("/logout",  (req,res,next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        
        req.flash("success_msg", "You have logged out");
        res.redirect('/');
      });
})



app.use('/', checkNotAuthenticated, isAdmin,(req,res) => {
    res.status(404);
    res.render('404', {
        title:'404 Page'
    })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/home")
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    
    
    res.redirect('/')
}

function isAdmin(req,res,next) {
    if (req.user.role === 'admin') {
        return next()
    }

    res.redirect('/home')
}

function isStatus(req,res,next) {
    if(req.user.status === 'closed'){
        res.redirect('/')
    }

    return next()
}























