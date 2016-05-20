var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

mongoose.connect('mongodb://localhost/shortly');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  var userSchema = mongoose.Schema({
    username: String,
    password: String
  });
  var linkSchema = mongoose.Schema({
    url: String,
    baseUrl: String,
    code: String,
    title: String,
    visits: Number
  });

  // run on creation
  linkSchema.methods.createShortURL = function() {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
  };
  // run on creation
  userSchema.methods.hashPassword = function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
      });
  };
  userSchema.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  };

  db.User = mongoose.model('User', userSchema);
  db.Link = mongoose.model('Link', linkSchema);

});

module.exports = db;

