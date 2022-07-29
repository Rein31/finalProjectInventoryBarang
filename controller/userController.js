// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// import barang
const user = require('../model/userModel')
// call express library
const app = express();
// call bcrypt library
const bcrypt = require('bcrypt')
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
    const status = req.body.status;
    console.log(username);
    console.log(password);
    console.log(email);
    console.log(role);

    let errors = [];

    if (!username || !password || !role || !status || ! email) {
        errors.push({ message : "Please enter all fields" })
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters"})
    }

    if (errors.length > 0) {
        res.render('user-add', {
            errors
        })
    }else {
        let hashPassword = await bcrypt.hash(password,10)
        await user.createUser(username, hashPassword, email, role, status)
        res.redirect('/user')

    }

}

// handle detail user
exports.detailUser = async function(req,res) {
    const idUser = req.params.idUser;
    const detailUser = (await user.detailUser(idUser))[0];
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
    const email = req.body.email;
    const alamat = req.body.alamat
    const telp = req.body.telp;
    const status = req.body.status;
    console.log(nama);
    console.log(username);
    console.log(password);
    console.log(email);
    console.log(alamat);
    await user.updateUser(idUser,nama,username,email,alamat,telp,status)
    res.redirect('/user')
}

// handle delete user post
exports.deleteUser = async function (req,res) {
    const idUser = req.body.idUser;
    const detailUser = (await user.detailUser(idUser))[0];

    if (!detailUser) {
        res.status(404)
        res.send(`id user of ${idUser} not found!`)
    }else{
        await user.deleteUser(idUser)
        res.redirect('/user')
    }
}

// handle reset password user
exports.resetPassword = async function (req,res) {
    const idUser = req.body.idUser;
    const password = '123456'
    let hashPassword = await bcrypt.hash(password,10)
    await user.resetPassword(idUser,hashPassword);
    res.redirect('/user')
}

// handle my profile
exports.myProfileView = async function (req,res) {
    const idUser = req.user.id_user
    const detailUser = (await user.detailUser(idUser))[0]
    console.log(detailUser);
    res.render('my-profile', {
        title : "Edit My Profile",
        detUser : detailUser,
    } )
}

exports.editProfile = async function (req,res) {
    
    let image
   
    const idUser = req.user.id_user
    const username = req.body.username;
    const nama = req.body.nama;
    const alamat = req.body.alamat;
    const email = req.body.email
    const telp = req.body.telp;
    let password = req.body.password1
    let hashPassword;
    const passwordConfirm = req.body.password2;
    let detailUser = {idUser,username,nama,alamat,email,image}
    let errors = [];
    const detUser = (await user.detailUser(idUser))[0]
    const findImgName = req.files.find((e) => e.filename)
    console.log(detUser.image);
    if (!findImgName) {
        image = 'default-user.png'
    }else if(findImgName) {
        image = req.files[0].filename
    }else {
        image = detUser.image
    }

    if (!username || ! email) {
        errors.push({ message : "Please enter username and email" })
    }

    if (password !== passwordConfirm) {
        errors.push({ message : "Password did no match!"})
    }

    if (errors.length > 0) {
        res.render('my-profile', {
            title : "Edit My Profile",
            detUser : detailUser,
            errors
        })
    }else {
        const detailUser = (await user.detailUser(idUser))[0]
        if (password == "") {
            hashPassword = detailUser.password
        }else{
            hashPassword = await bcrypt.hash(password,10)
        }
        if (detailUser.image !== 'default-user.png') {
            fs.unlink('public/images/'+detailUser.image, (err => {
                if (err) console.log(err);
                else {
                  console.log("\nDeleted file: "+detailUser.image);
                
                }
            }))
        }
        await user.updateUserWithoutStatus(idUser,nama, username, hashPassword, email, alamat, telp, image)
        res.redirect('/myProfile')

    }
}