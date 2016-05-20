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


  // var testUser = new User({username: 'super1', password: 'fluffy'});
  // testUser.hashPassword();
  // testUser.save().then(user => {
  //   User.find({username: 'super1'}).then(user => {
  //     user[0].comparePassword('fluffy', isMatch => console.log('is it a match?', isMatch));
  //   });
  // });


});

module.exports = db;

  // var testUser = new User({username: 'hello', password: 'goodbye'});
  // testUser.save(function(err, user) {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   User.find(function(err, user) {
  //     if (err) {
  //       return console.error(err);
  //     }
  //     console.log(user);
  //   });
  // });


// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;
