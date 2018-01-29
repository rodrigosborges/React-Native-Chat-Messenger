"use strict";
var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var sequelize = require('../db');
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// user - message
db.message.belongsTo(db.user, {foreignKey: 'user_id'})

// user - contacts

db.contact.belongsTo(db.user, {as: 'user',foreignKey: 'contact_id'})
module.exports = db;