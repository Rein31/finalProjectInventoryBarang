// call exprees module
const express = require("express");
// call expressLayout module
var expressLayouts = require('express-ejs-layouts');
// import barang
const barang = require('../model/barangModel')
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

// handle all list barang
exports.listBarang = async function (req,res) {
    const allBarang = await barang.listBarang();
    const listKategori = await barang.listKategori();
    // console.log(req);
    res.render('barang-list', {
        title : 'List Barang',
        listBarang : allBarang,
        listKat : listKategori,
        // layout : main,
    }) 
}

// handle add-barang view
exports.addBarangView = async function(req,res) {
    const listKategori = await barang.listKategori();
    res.render('barang-add', {
        title : 'Add Barang',
        err : '',
        listKat : listKategori
    }) 
}

// handle create barang (namaBarang,stok,harga,kategori,image)
exports.newBarang = async function (req,res) {
    let image
    const findImgName = req.files.find((e) => e.filename)
    if (!findImgName) {
        image = 'default-product.png'
    }else{
        image = req.files[0].filename
    }
    // image = req.file[0].filename
    const nama = req.body.namaBarang;
    const stok = req.body.stok;
    const harga = req.body.harga;
    const kategori = req.body.kategori;

    console.log(nama);
    console.log(stok);
    console.log(harga);
    console.log(kategori);
    console.log(image);
    await barang.createBarang(nama,stok,harga,kategori,image)
    res.redirect('/barang')
}

// handle detail Barang
exports.detailBarang = async function(req,res) {
    const idBarang = req.params.idBarang;
    const detailBar = (await barang.detailBarangWithStok(idBarang))[0];
    const detailTransBarang = await barang.detailBarangTransaksi(idBarang);
    // console.log(detailBar);
    // console.log(detailTransBarang);
    res.render('barang-detail', {
        title : "Detail Barang",
        detBarang : detailBar,
        detTransBar : detailTransBarang,
    })
}

// handle update barang view
exports.updateBarangView = async function (req,res) {
    const idBarang = req.body.idBarang;
    const detailBar = (await barang.detailBarangWithoutStok(idBarang))[0]
    const listKategori = await barang.listKategori();
    console.log(listKategori);
    res.render('barang-update-detail', {
        title : "Update Barang",
        detBarang : detailBar, 
        listKat : listKategori,
    })
}

// handle update barang post
exports.updateBarangSend = async function (req,res) {
    const idBarang = req.body.idBarang;
    const nama = req.body.namaBarang;
    const harga = req.body.harga;
    const kategori = req.body.kategori;
    let image
    const findImgName = req.files.find((e) => e.filename)
    if (!findImgName) {
        image = req.body.oldImage;
    }else{
        image = req.files[0].filename
    }

    console.log(nama);
    console.log(harga);
    console.log(kategori);
    console.log(image)
    await barang.updateBarang(idBarang,nama,harga,kategori,image)
    res.redirect('/barang')
}

// handle delete barang post
exports.deleteBarang = async function (req,res) {
    const idBarang = req.body.idBarang;
    const detBarang = (await barang.detailBarangWithoutStok(idBarang))[0]

    if (!detBarang) {
        res.status(404)
        res.send(`id product of ${idBarang} not found!`)
    }else{
        if (detBarang.image !== 'default-product.png') {
            fs.unlink('public/images/'+detBarang.image, (err => {
                if (err) console.log(err);
                else {
                  console.log("\nDeleted file: "+detBarang.image);
                
                }
            }))
        }
        
        await barang.deleteBarang(idBarang)
        res.redirect('/barang')
    }
}

// handle add kategori
exports.addKategori = async function (req,res) {
    const newKategori = req.body.namaKategori
    await barang.addNewKategori(newKategori);
    res.redirect('/addBarang-form')
}