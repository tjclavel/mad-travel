"use strict";

var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
  title: String,
  skills: String,
  image: String,
  description: String,
  email: String,
  numVolunteers: Number,
  startTime: String,
  endTime: String,
  date: String,
  _location: String,
  commitment: Number
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project
