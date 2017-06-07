"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');
var session = require('express-session');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');
var Project = require('./schema/project.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line
//var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.

app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));

app.use(express.static(__dirname));

//For sending emails
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

app.use(bodyParser.json());
app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */

app.post('/sendmail', function(req, res){

    var options = {
        auth: {
            api_key: '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'
        }
    }
    var mailer = nodemailer.createTransport(sgTransport(options));
    mailer.sendMail(req.body, function(error, info){
        if(error){
            console.log(error);
            res.status('401').json({err: info});
        }else{
            console.log("Email sent");
            res.status('200').json({success: true});
        }
    });
});

app.post('/admin/login', function(request, response) {
  if(request.body.password === "doggo") {
    request.session.admin = true;
    response.status(200).send("Successfully logged in");
    return;
  }
  response.status(400).end("Incorrect password.");
});

app.post('/add/project', function(req, res) {
  if(!req.session.admin) {
    console.log("You are not logged in!");
    res.status(401).end("Unauthorized");
    return;
  }
  console.log(req.body);
  Project.create({
                  title: req.body.title,
                  skills: req.body.skills,
                  email: req.body.email,
                  image: req.body.image,
                  description: req.body.description,
                  numVolunteers: req.body.numVolunteers,
                  startTime: req.body.startTime,
                  endTime: req.body.endTime,
                  date: req.body.date,
                  _location: req.body._location,
                  commitment: req.body.commitment,
                 });
  res.status(200).send("added project");
});

app.get('/load/projects', function(req, res) {
  Project.find({}, function(err, projects) {
    res.status(200).send(JSON.stringify(projects));
  });
});

app.get('/project/:projectId', function(req, res) {
  var projectId = req.params.projectId;
  Project.findOne({_id: projectId}, function(err, project) {
    res.status(200).send(JSON.stringify(project));
  });
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


