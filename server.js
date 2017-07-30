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
var Grid = require('gridfs-stream');
var gfs;
var async = require('async');
var session = require('express-session');
var stream = require('stream');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');
var Project = require('./schema/project.js');
var fs = require("fs");
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
var express = require('express');
var app = express();

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
            api_key: process.env.SG_API_KEY
        }
    };
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

app.get('/load/projects/:sort_criteria', function(req, res) {
  var sort_criteria = req.params.sort_criteria;

  if(sort_criteria === "lowest_commitment_first"){
    Project.find({}).sort({commitment: 1}).exec(function(err, projects) {
      res.status(200).send(JSON.stringify(projects));
    });
  }else if(sort_criteria === "earliest_start_date_first"){
    Project.find({}).sort({startDate: 1}).exec(function(err, projects) {
      res.status(200).send(JSON.stringify(projects));
    });
  }

});

app.get('/project/:projectId', function(req, res) {
  var projectId = req.params.projectId;
  Project.findOne({_id: projectId}, function(err, project) {
    res.status(200).send(JSON.stringify(project));
  });
});

app.get('/download_image/:image_id', function(req, res) {
  console.log("Hello");
   var readstream = gfs.createReadStream({
      _id: req.params.image_id
   });//it is not finding a file with this ID
   readstream.pipe(res);
}); //change the front-end code

app.post('/add/project', function(request, response){
    console.log('adding project')
    processFormBody(request, response, function (err) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
            return;
        }
        console.log(request);

        if(!request.file){
            response.status(400).send();
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes
        if(request.file.fieldname !=="uploadedphoto" || request.file.originalname===""){
            response.status(500).send("Request properties not correctly set");
            return;
        }
        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        var timestamp = new Date().valueOf();
        var filename = 'U' +  String(timestamp) + request.file.originalname;

        var bufferStream = new stream.PassThrough();
        bufferStream.end(request.file.buffer);

        var writestream = gfs.createWriteStream({
          filename: filename,
          mode: 'w',
          content_type: request.file.mimetype,
        });

        bufferStream.pipe(writestream);

        writestream.on('close', function(file) {
          Project.create({
            title: request.body.title,
            skills: request.body.skills,
            email: request.body.email,
            image_id: file._id,
            description: request.body.description,
            numVolunteers: request.body.numVolunteers,
            numVolunteersSignedUp: 0,
            volunteers: [],
            startDate: request.body.startDate,
            endDate: request.body.endDate,
            _location: request.body._location,
            commitment: request.body.commitment,
          }, function(err, project){
              console.log("project added successfully");
              response.status(200).send(JSON.stringify(project));
          });

        });
    });
});

app.post('/delete/project/:projectId', function(request, response){
  console.log(request.params.projectId);
  Project.findOne({_id: request.params.projectId}).remove(function(err, project) {
    console.log("hello");

    if(err){
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if(project === null){
      response.status(400).send("No existing project");
      return;
    }
    return response.status(200).send();
  });

});

app.post('/volunteer_signed_up/:projectId', function(request, response){
  var volunteer = request.body.volunteer;

  Project.findOne({_id: request.params.projectId}, function(err, project) {

    if(err){
      response.status(500).send(JSON.stringify(err));
      return;
    }

    if(project === null){
      response.status(400).send("No existing project");
      return;
    }

    project.numVolunteersSignedUp = project.numVolunteersSignedUp + 1;
    project.volunteers.push(volunteer);

    project.save();

    console.log(project);

    response.status(200).send(JSON.stringify(project));
  });

});

// var server = app.listen(3000, function () {
//     var port = server.address().port;
//     console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
// });

//'mongodb://localhost/cs142project6'
//process.env.MONGODB_URI
//Use above when working on localhost.
mongoose.connect('mongodb://localhost/cs142project6', function(err){
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Database connection ready");

  gfs = Grid(mongoose.connection.db, mongoose.mongo);

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});



// function putFile(path, name, callback) {
//     var writestream = GridFS.createWriteStream({
//         filename: name
//     });
//     writestream.on('close', function (file) {
//       callback(null, file);
//     });
//     fs.createReadStream(path).pipe(writestream);
// }

// try {
//     var readstream = GridFS.createReadStream({filename: filename});
//     readstream.pipe(res);
// } catch (err) {
//     log.error(err);
//     return next(errors.create(404, "File not found."));
// }








