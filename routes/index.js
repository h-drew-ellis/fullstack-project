const express = require('express')
const router = express.Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const { check } = require('express-validator')
const saltRounds = 10


///gets
router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/home', (req, res) => {
    res.render('home')
})


///posts
router.post("/login", (req, res) => {
    db.User.findOne({
        where: {
            username: req.body.loginUser
        }
    }).then(function(user) {
        if (!user) {
            res.redirect('/')
        } else {
            bcrypt.compare(req.body.loginPass, user.password, function(err, result) {
                if (result == true) {
                    console.log('logging in')
                    res.redirect('/home')
                } else {
                    res.send('Incorrect Password')
                    res.redirect('/')
                }
            })
        }
    })
})


/*=============================================================================*/
///REGISTER POST////
/*=============================================================================*/
router.post('/registerUser', [
    check('username').custom(value => {
        return User.findByUsername(value).then(user => {
            if (user) {
                return Promise.reject('Username is already taken')
            }
        })
    }), check('email').custom(value => {
        return User.findByEmail(value).then(user => {
            if (user) {
                return Promise.reject('Account is tied to Email')
            }
        })
    }), check('pass1').custom(value => {
        if (value !== req.body.pass2) {
            throw new Error('Passwords do not match, please try again')
        }
    })
], (req, res) => {
    bcrypt.hash(req.body.pass1, saltRounds, function(err, hash) {
        db.User.create({
            username: req.body.username,
            password: hash,
            first: req.body.firstName,
            last: req.body.lastName,
            email: req.body.email
        }).then(function(data) {
            if (data) {
                res.redirect('/')
            }
        })
    })
})



module.exports = router