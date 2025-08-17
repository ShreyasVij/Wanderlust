const User = require("../models/user.js");
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const regUser = await User.register(newUser, password);
        console.log(regUser);
        req.login(regUser, (err) => { //After signup automatically loggin 
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
            // res.flash("succes","Welcome to Wanderlust! Your Logged in !");
            let redirectUrl = res.locals.redirectUrl || "/listings";
            /*If res.locals.redirectUrl is defined and truthy, redirectUrl will be its value.
If res.locals.redirectUrl is undefined, null, or falsy, redirectUrl will be "/listings".
*/
            res.redirect(redirectUrl);

}
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){return next(err);}
        req.flash("success","You have successfully logged out! ");
    res.redirect("/listings");
    })
    
}