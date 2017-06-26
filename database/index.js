var mongoose = require('mongoose');

// for development only: not for deployment
// comment out before pull request:
// var secret = require('../secret.js');

// choose between env variables for Heroku or dev env
var mongodb_user = process.env.MONGODB_USER || secret.MONGODB_USER;
var mongodb_password = process.env.MONGODB_PASSWORD || secret.MONGODB_PASSWORD;

mongoose.connect(`mongodb://${mongodb_user}:${mongodb_password}@ds139352.mlab.com:39352/geomusic`);
var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var Schema = mongoose.Schema;

var itemSchema = mongoose.Schema({
  quantity: Number,
  description: String
});

var Item = mongoose.model('Item', itemSchema);

var selectAll = function(callback) {
  Item.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

// create a new db item for test:
// Item.create({ quantity: 2, description: 'test' }, function(err) {
//   if (err) {
//     console.error(err);
//   }
// })

module.exports.selectAll = selectAll;
module.exports.Item = Item;
