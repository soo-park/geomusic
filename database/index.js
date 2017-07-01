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

var pinSchema = mongoose.Schema({
  location: {
    type: { type: String },
    coordinates: []
  },
  playlistUrl: String,
  playlistName: String
  // createdAt: { type: Date, default: Date.now, expires: 86400 }
});
pinSchema.index({ location: '2dsphere' });
var Pin = mongoose.model('Pin', pinSchema);

var selectAll = function(callback) {
  Pin.find({}, function(err, pins) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

// get a list of pins within 1 mile:
// (lng and lat are the longitude and latitude of the current location of a user)
var getPinsWithinRadius = function(lng, lat, callback) {
  var milesToRadian = function(miles) {
    var earthRadiusInMiles = 3959;
    return miles / earthRadiusInMiles;
  };
  var query = {
    location : {
        $geoWithin : {
            $centerSphere : [ [lng, lat], milesToRadian(1) ]
        }
    }
  };
  Pin.find(query, function(err, pins) {
    if (err) {
      console.error(err);
    } else {
      //console.log('pins within 1 mile:', pins);
      callback(null, pins);
    }
  })
}
//getPinsWithinRadius(-122.407087, 37.783506);

// create a new db pin for test:
// running it creates an entry every time, comment out after creating:

// Pin.create({ location: { type: 'Point', coordinates: [-122.408942, 37.783696] }, playlistUrl: 'https://api.spotify.com/v1/users/wizzler/playlists?offset=0&limit=20', playlistName: 'My Playlist' }, function(err) {
//   if (err) {
//     console.error(err);
//   }
// })
//
// Pin.create({ location: { type: 'Point', coordinates: [-122.406646, 37.784612] }, playlistUrl: 'https://open.spotify.com/user/1299590238/playlist/617wZsy9snEuDw2YV7lIq0', playlistName: 'Cozy' }, function(err) {
//   if (err) {
//     console.error(err);
//   }
// })
//
// Pin.create({ location: { type: 'Point', coordinates: [-122.410124, 37.783251] }, playlistUrl: 'https://open.spotify.com/user/1269933467/playlist/0o7b29K3eZ3BNnZswZ9sAC', playlistName: 'Favourites' }, function(err) {
//   if (err) {
//     console.error(err);
//   }
// })
// Pin.create({ location: { type: 'Point', coordinates: [-122.388633, 37.790001] }, playlistUrl: 'https://open.spotify.com/user/1269933467/playlist/0o7b29K3eZ3BNnZswZ9sAC', playlistName: 'Playlist' }, function(err) {
//   if (err) {
//     console.error(err);
//   }
// })

module.exports.getPinsWithinRadius = getPinsWithinRadius;
module.exports.selectAll = selectAll;
module.exports.pin = Pin;
