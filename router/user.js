const express = require('express')
const wrapAsync = require('../utils/wrapAsync')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const { userPath } = require('../middleware')
const usercontroller= require('../controllers/user')

router.route("/signup")
    .get(wrapAsync(usercontroller.renderSignUPform))
    .post(wrapAsync(usercontroller.succsssSignUP))

router.route("/login")
    .get(usercontroller.renderLoginForm)
    .post(
        userPath,
        passport.authenticate(
        "local",{
        failureRedirect:"/login",
        failureFlash:true}),
        usercontroller.loginAuth
    )

router.get("/logout",usercontroller.userLogout)

module.exports = router