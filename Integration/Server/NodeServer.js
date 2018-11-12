var express = require('express');
var app = express();
var cors = require('cors'); //Cross-origin resource sharing
app.use(cors());
var bodyParser = require('body-parser'); //For parsing to JSON
var mongojs = require('mongojs');
var db = mongojs('coupon', ['code']); //"coupon" is name of database & "code" is name of collection
app.use(express.static(__dirname));
var events=require('events');
var em= new events.EventEmitter();
var fs = require('fs');

//logging entry in file
var msg="Directory Name: "+ __dirname + "\n" +
"StartTimeStamp: "+(new Date(Date.now()+"\n"))+
"File Name: "+__filename+"\n"+
"Process Version: "+process.version+"\n"+
"Process Time: "+process.uptime()+"\n"+
"Memory Use: "+JSON.stringify(process.memoryUsage())+"\n";

var write=function(){
  try{
    fs.appendFile("D:\\Mahavir\\Angular Tutorial\\project\\src\\logFile.txt", msg+"------------------------------------"
    +"\n"+"\n" , 
    function(err){  
    });
  }
  catch(err){}
};

var logger=function(){
    em.on('error',function(err){
    });
    em.on('event1',write);
    em.emit ('event1');
  }; 

// List all Coupon code
app.get('/couponList', function (req, res) {
    db.code.find({}, function (err, docs) {
        res.json(docs);
    });
    logger(); 
});

// Get best offers from database i.e coupons which have mandatory 5 star reviews along with type as Free or 90% discount or Rs. 500 cash back  
app.get('/best', function (req, res) {
    db.code.find({ $and: [{ reviews: { $eq: 5 } }, { $or: [{ type: { $eq: "FREE" } }, { type: { $eq: "90% Discount" } }, { type: { $eq: "Rs.500 Cash Off" } }] }] }, function (err, docs) {
        res.json(docs);
    });
    logger(); 
});

// Admin login check
app.get('/login', function (req, res) {
    db.login.find({}, function (err, docs) {
        res.json(docs);
    });
    logger(); 
});

// Get Subscribed users
app.get('/getSubscribers', function (req, res) {
    db.email.find({}, function (err, docs) {
        res.json(docs);
    });
    logger(); 
});

// Get all Posts
app.get('/getPosts', function (req, res) {
    db.post.find({}, function (err, docs) {
        res.json(docs);
    });
    logger(); 
});

// Get posts by category
app.get('/getPostsByCategory/:id', function (req, res) {
    db.post.find({ category: { $eq: req.params.id } }, function (err, docs) {
        res.json(docs);
    });
    logger(); 
});

// List of coupon based on type
app.get('/type/:id', function (req, res) {
    db.code.find({ type: { $eq: req.params.id } }, function (err, docs) {
        res.json(docs);
    });
    logger(); 
});

// List of coupon based on categories
app.get('/:id', function (req, res) {
    db.code.find({ category: { $eq: req.params.id } }, function (err, docs) {
        res.json(docs);
    });
    logger(); 
});

// Send subscribed emails
app.get('/email/:email', function (req, res) {
    var emailId = req.params.email;
    db.email.insert({ emailId });
    db.email.find({}, function (err, data) {
        res.send(data)
    });
    logger(); 
});

// Adding Record in MongoDB
app.get('/addRecord/:data', function (req, res) {
    var data = JSON.parse(req.params.data);
    db.code.insert(data);
    db.code.find({}, function (err, data) {
        res.send(data)
    });
    logger(); 
})

// Removing Record in MongoDB
app.get('/removeRecord/:data', function (req, res) {
    var data = parseInt(req.params.data);
    db.code.remove({ _id: data });
    db.code.find({}, function (err, data) {
        res.send(data)
    });
    logger(); 
})

// Adding post in MongoDB
app.get('/writePost/:data', function (req, res) {
    var data = JSON.parse(req.params.data);
    db.post.insert(data);
    db.post.find({}, function (err, data) {
        res.send(data)
    });
    logger(); 
})

//user registration
app.get('/userSignup/:data',
    function (req, res) {
        var data = JSON.parse(req.params.data);
        db.users.insert(data);
        db.users.find({}, function (err, data) {
            res.send(data)
        });
        logger(); 
    })

//user check login
app.get('/userLogin/:data',
    function (req, res) {
        db.users.find({ _id: req.params.data }, { _id: 1, password: 1 }, function (err, data) {
            res.send(data)
        });
        logger(); 
    })

//get Post by ID
app.get('/getPost/:data',
    function (req, res) {
        db.post.find({ name: req.params.data }, function (err, data) {
            res.send(data)
        });
        logger(); 
    })

app.listen(3001);