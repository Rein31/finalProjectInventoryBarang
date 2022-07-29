const expressEjsLayouts = require('express-ejs-layouts');
const log = require('../model/loggerModel')

// method, url,username,name,role
exports.logger = async (req, res, next)=> {
    const method = req.method;
    const url = req.url;
    let role;
    let username;
    let nama;
    if (req.user === undefined) {
        role = '-'
        username = 'Anonim'
    } else{
        username = req.user.username;
        nama = req.user.nama;
        role = req.user.role;
    }
    // console.log(req);
    // console.log(method);
    // console.log(req.statusCode);
    // console.log(url);
    // console.log(username);
    // console.log(nama);
    // console.log(role);

    await log.loggerNoted(method, url,username,nama,role);

    next()
    
  };

exports.listLogger = async (req,res) => {
    const listLogger = await log.listLog();
    res.render('log', {
        title : 'Log',
        listLog : listLogger
    })
}