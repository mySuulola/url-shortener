'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')



var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.SECRET, {useNewUrlParser: true}, (err) => {
  if(err) {console.log('Problem Connecting...')
      }else {console.log('Connected to DB')}
});
mongoose.Promise = global.Promise
var urlSchema = new mongoose.Schema({
  original_url: {type: String},
  short_url: {type: Number},
})

var Url = mongoose.model("Url", urlSchema)
//Basic Config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.redirect('/api/shorturl/new')
  //res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/shorturl/new", function (req, res) {
  
  res.render('index.ejs');
});

app.post("/api/shorturl/new", (req,res,next) => {
 var short = Math.floor(Math.random() * 1000)
  Url.create({
    original_url: req.body.original_url,
     "short_url": short
   }, (err, data) => {
  if(err){
    res.json({error: err.message})
  }else{ console.log(data)
  if (req.body.original_url.match(/^http(s)?:\/\//)){ 
   res.json({"original_url": data.original_url, "short_url": data.short_url })
 }else{
   res.json({"error":"invalid URL"})
 //  done(null, data)
 }}
  }
)
  
//  }  
})


app.get("/api/shorturl/new/:id", (req,res) => {
  var direction = req.params.id
  //res.json({message: direction})
  Url.findOne({short_url: direction}, (err, data) => {
    if(err) {
      res.json({"message": 'wahala dey', err})
    }else {
      res.redirect(data.original_url)
    }
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
    
});