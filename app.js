if(process.env.NODE_ENV != "production"){//We ususally remove this while in production
require("dotenv").config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");

const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const session = require("express-session");
const MongoStore = require("connect-mongo")
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { resolveAny } = require("dns");
const userRouter = require("./routes/user.js");
const { cookie } = require("express/lib/response.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended :true}));//used to pars all the data
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

const dbUrl=process.env.ATLASDB_URL
main().then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.secret
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", error)
});

const sessionOption={
    store,
    secret:process.env.secret,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge :+7*24*60*60*1000,
        httpOnly:true
    }
};




// app.get("/",(req,res)=>{
//     res.send("site is active")
// })
//middleware of session
app.use(session(sessionOption));
//middleware for flash
app.use(flash());

//now for passport ->middleware that intitalises
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.CurUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})




passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




app.use((req, res, next) => {//for any other route which we have not definded
    const err = new ExpressError(404, "Page not found!");
    next(err);
});



app.use((err,req,res,next)=>{//error middlewaree
    let {statusCode=500,message="Something went wrong !"} = err;
    res.render("error.ejs",{statusCode,message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
console.log("listening to port 8080");
});
