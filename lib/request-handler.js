var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

var db = require('../app/config');
// var User = require('../app/models/user');
// var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  db.Link.find().then(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  db.Link.findOne({url: uri}).then(link => {
    if (link) {
      res.status(200).send(link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new db.Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
          visits: 0
        });
        newLink.createShortURL();
        newLink.save().then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  }).catch(err => console.error(err));
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({ username: username })
    .then(user => {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    }).catch(err => console.error(err));
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({ username: username })
    .then(user => {
      if (!user) {
        var newUser = new db.User({
          username: username,
          password: password
        });
        newUser.hashPassword();
        newUser.save()
          .then(newUser => util.createSession(req, res, newUser))
            .catch(err => console.error(err));
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    }).catch(err => console.error(err));
};

exports.navToLink = function(req, res) {
  db.Link.findOne({ code: req.params[0] })
    .then(link => {
      if (!link) {
        res.redirect('/');
      } else {
        console.log('link', link);
        db.Link.update({url: link.url}, { visits: link.visits + 1 })
          .then(() => res.redirect(link.url))
          .catch(err => console.error(err));
      }
    });
};