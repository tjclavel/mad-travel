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
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    User.find({}, "_id first_name last_name", function(err, userList) {
      if(err) {
        console.log("Got error retrieving user list");
        response.status(400).end(JSON.stringify(err));
        return;
      }
      if(userList.length === 0) {
        console.log("Couldn't find user list");
        response.status(400).end("Not found");
        return;
      }
      response.status(200).send(JSON.stringify(userList));
    });
});

/*
 * URL /user/:id - Return the information for User (id) TODO
 */
app.get('/user/:id', function (request, response) {
    var id = request.params.id;
    User.findOne({_id : id}, "_id first_name last_name location description occupation", function(err, user) {
      if(err) {
        console.log("Got error searching for a user: " + JSON.stringify(err));
        response.status(400).end(JSON.stringify(err));
        return;
      }
      if(user.length === 0) {
        console.log("Couldn't find user with id " + id);
        response.status(400).end("Not found");
        return;
      }
      response.status(200).send(JSON.stringify(user));
    });

});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id) TODO
 */
app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
    Photo.find({user_id : id}, "_id user_id comments file_name date_time", function(err, photos) {
      if(err) {
        console.log("Got error looking for photo list for a user");
        response.status(400).end(JSON.stringify(err));
        return;
      }
      if(photos.length === 0) {
        console.log("Couldn't find photos for user " + id);
        response.status(400).end("Not found");
        return;
      }
      photos = JSON.parse(JSON.stringify(photos));
      async.each(photos, function(photo, done_photo) {
        async.forEachOf(photo.comments, function(comment, index, done_comment) {
          var updated_comment = {comment: comment.comment,
                                 date_time: comment.date_time,
                                 _id: comment._id};
          User.findOne({_id : comment.user_id}, "_id first_name last_name", function(user_err, user) {
            if(user_err) {
              done_comment("Got error retrieving user data for comment");
            }
            if(user.length === 0) {
              done_comment("User data not found");
            }
            updated_comment.user = user;
            photo.comments[index] = updated_comment;
            done_comment();
          });
          
        }, function(comment_err) {
          if(comment_err) {
            done_photo(comment_err);
          }
          done_photo();
        });
      }, function(photo_err) {
        if(photo_err) {
          console.log(photo_err);
          response.status(400).end(photo_err);
          return;
        }
        response.status(200).send(JSON.stringify(photos));
      });
    });

});

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

app.post('/add/project', function(req, res) {
  Project.create({
                  title: req.body.title,
                  skills: req.body.skills,
                  email: req.body.email,
                  image: req.body.image,
                  description: req.body.description,
                  numVolunteers: req.body.numVolunteers
                 });
  res.status(200).send("added project");
});

app.get('/load/projects', function(req, res) {
  console.log("hello");
  Project.find({}, function(err, projects) {
    console.log(projects);
    res.status(200).send(JSON.stringify(projects));
  });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


