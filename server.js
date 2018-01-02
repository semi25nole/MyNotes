"use strict"
//Here we load our dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var path = require("path");
var mongoose = require("mongoose");


//Now lets create a variable to hold our express function
var app = express();


//Create a variable to hold the port
var port = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"


//Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));


//connect to mongodb
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});


//Let's configure out database
var databaseUrl = "NOTE";
var collections = ["notes"];


//tie mongojs into the db
var db = mongojs(databaseUrl, collections);


//assign any errors into the console
db.on("error", function(error) {
    console.log("Database Error: ", error);
    res.send(error);
});


//Let's define our routes
//Let's create our route to the home page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


//Let's create a route for the submission of our notes into the db
app.post("/submit", function(req, res) {
    console.log(req.body);
    //put the note into the notes collection
    db.notes.insert(req.body, function(error, saved) {
        if(error) {
            console.log(error);
        } else {
            console.log(saved);
        }
    });
});


//Let's create a route to get back those results from the db
app.get("/all", function(req, res) {
    db.notes.find({}, function(error, found) {
        if(error) {
            console.log(error);
        } else {
            res.json(found);
        }
    });
});


//Let's create a route to find a note by it's id
app.get("/find/:id", function(req, res) {
    db.notes.findOne({"_id": mongojs.ObjectID(req.params.id)
    }, function(error, found) {
        if(error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(found);
            res.send(found);
        }
    });
});


//Let's create a route to update any notes that we create
app.post("/update/:id", function(req, res) {
    db.notes.update({
        "_id": mongojs.ObjectID(req.params.id)
    }, {
        $set: {
            "title": req.body.title,
            "note": req.body.note,
            "modified": Date.now()
        }
    }, function (error, edited) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(edited);
            res.send(edited);
        }
    });
});


//Let's create a route to delete a note from the db
app.get("/delete/:id", function(req, res) {
    db.notes.remove({
        "_id": mongojs.ObjectID(req.params.id)
    }, function(error, removed) {
        if(error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(removed);
            res.send(removed);
        }
    });
});


//Let's clear the db
app.get("/clear", function(req, res) {
    db.notes.remove({}, function(error, response) {
        if(error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(response);
            res.send(response);
        }
    });
});


//Tell the app to listen
app.listen(port, function() {
    console.log("App is listening on Port: " + port);
});