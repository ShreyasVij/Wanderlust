const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const{saveRedirectUrl}=require("../middleware.js")
const userController = require("../controllers/users.js")

router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signup)
);
router.get("/login",userController.renderLoginForm)
//Authentication of teh user is donw by the middleware of passport
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:"/login", 
            failureFlash: true
        }),
        userController.login);

router.get("/logout",userController.logout);

module.exports=router;