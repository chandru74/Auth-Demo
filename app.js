var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Auth',{useNewUrlParser:true,useUnifiedTopology: true});

app.use(bodyparser.urlencoded({extended:true}));

app.listen(8000,()=>{
    console.log("Yeah, listening")
})