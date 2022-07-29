// call LocalStrategy
const LocalStrategy = require("passport-local").Strategy;
// call pool
const pool = require('./db');
// call bcrypt
const bcrypt = require('bcrypt');
const { authenticate, initialize } = require("passport");

function initialized(passport) {
    const authenticateUser = (username, password, done) => {
        pool.query(
            `SELECT * FROM public."user" WHERE username = $1`,
            [username],
            (err,results) => {
                if (err) {
                    throw err;
                }

                console.log(results.rows);

                if (results.rows.length > 0) {
                    
                    const user = results.rows[0];

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err
                        }

                        if (isMatch) {
                            return done(null, user)
                        }else {
                            return done(null, false, {message: "Password is not correct!"})
                        }
                    })
                }else {
                    return done(null, false, {message: "Usename is not registered!"})
                }
            }
        )
    }    

    passport.use(
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password"
            },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id_user));

    passport.deserializeUser((id_user, done) => {
        pool.query(`SELECT * FROM public."user" WHERE id_user = $1`, [id_user], (err,results) => {
            if (err) {
                throw err;
            }
            return done(null, results.rows[0])
        })
    })
}

module.exports = initialized;