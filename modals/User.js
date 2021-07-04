const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },

}, { timestamps: true })


UserSchema.pre("save", function (next) {
    var user = this;
  
    if (user.isModified("password")) {
      // console.log('password changed')
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
  
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
        });
      });
    } else {
      next();
    }
  });
  
  UserSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };
  
  UserSchema.methods.generateToken = function (cb) {
    var user = this;
    console.log("user", user);
    //var userId = user._id.toHexString()
    //console.log('userSchema', userSchema)
    let token = jwt.sign(user._id.toHexString(), process.env.JWT_SECRET_KEY );
    //let token =  jwt.sign( userId + user.name +user.email + user.password ,'secret')
  
    console.log(token);
    var oneHour = moment().add(1, "hour").valueOf();
  
    user.tokenExp = oneHour;
    user.token = token;
    user.save(function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  };
  
  UserSchema.statics.findById = function (token, cb) {
    var user = this;
  
    jwt.verify(token,process.env.JWT_SECRET_KEY , function (err, decode) {
      user.findOne({"_id": decode, }, function (err, user) {
       // console.log(  "Id",user._id);
        if (err) return cb(err);
        cb(null, user);
  
      });
    });
  };
  

const User = mongoose.model('User', UserSchema);

module.exports = { User };