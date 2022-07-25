// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// import barang
const user = require('../model/userModel')
// call express library
const app = express();
// information using ejs
app.set('view engine', 'ejs')
// use express static for public folder
app.use(express.static('public'))
// use express layout
app.use(expressLayouts);
// set default layout for all routing
app.set('layout', 'layouts/main');

// handle all list user
exports.listUser = async function (req,res) {
    const allUserList = await user.listUser();
    res.render('user-list', {
        title : 'List User',
        listUser : allUserList,
    }) 
}

// handle add new user
exports.addUserView = async function(req,res) {
    res.render('user-add', {
        title : 'Add new User',
        err : '',
    }) 
}

// handle create user (username, password, email, roll)
exports.newUser = async function (req,res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
    const telp = req.body.telp;
    const status = req.body.status;
    console.log(username);
    console.log(password);
    console.log(email);
    console.log(role);
    await user.createUser(username, password, email, role, telp, status)
    res.redirect('/user')
}

// handle detail user
exports.detailUser = async function(req,res) {
    const idUser = req.params.idUser;
    const detailUser = (await user.detailUser(idUser))[0];
    // console.log(detailSup);
    res.render('user-detail', {
        title : "Detail User",
        detUser : detailUser,
    })
}

// handle update user view
exports.updateUserView = async function (req,res) {
    const idUser = req.body.idUser;
    const detailUser = (await user.detailUser(idUser))[0];
    res.render('user-update-detail', {
        title : "Update User",
        detUser : detailUser,  
    })
}

// handle update user post (nama, username, password, email, alamat)
exports.updateUserSend = async function (req,res) {
    const idUser = req.body.idUser
    const nama = req.body.nama;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const alamat = req.body.alamat
    const telp = req.body.telp;
    const status = req.body.status;
    console.log(nama);
    console.log(username);
    console.log(password);
    console.log(email);
    console.log(alamat);
    await user.updateUser(idUser,nama,username,password,email,alamat,telp,status)
    res.redirect('/user')
}

// handle delete user post
exports.deleteUser = async function (req,res) {
    const idUser = req.body.idUser;
    const detailUser = (await user.detailUser(idUser))[0];
    console.log(idUser);
    console.log(detailUser);

    if (!detailUser) {
        res.status(404)
        res.send(`id user of ${idUser} not found!`)
    }else{
        await user.deleteUser(idUser)
        res.redirect('/user')
    }
}