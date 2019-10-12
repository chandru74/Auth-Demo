var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStratergy = require('passport-local');
var PassportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user'); 

mongoose.connect('mongodb://localhost:27017/Auth',{useNewUrlParser:true,useUnifiedTopology: true});

app.use(require('express-session')({
    secret:"Don't put the blame on me i am just a human after all",
    resave:false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));


//ROUTES
app.get('/',(req,res)=>{
    res.render("home");
})
app.get('/secret',isLoggedIn,(req,res)=>{
    res.render("secret");
})

//App routes
app.get('/register',(req,res)=>{
    res.render("register");
})

app.post('/register',(req,res)=>{
    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req,res,()=>{
            res.redirect('/secret');
        })
    })
})

//Login Routes
app.get('/login',(req,res)=>{
    res.render("login");
})

app.post('/login',passport.authenticate("local",{
    successRedirect:'/secret',
    failureRedirect: '/login'
}),(req,res)=>{

})

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/')
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/login');
    }
}

app.listen(8000,()=>{
    console.log("Yeah, listening")
})