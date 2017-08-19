"use strict";

var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
  title: String,
  skills: String,
  filename: String,
  description: String,
  email: String,
  numVolunteers: Number,
  numVolunteersSignedUp: Number,
  volunteers: [],
  startDate: String,
  endDate: String,
  _location: String,
  commitment: Number
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
