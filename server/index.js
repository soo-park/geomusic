//var secret = require('../secret.js'); // for development only: not for deployment
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var db = require('../database');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client/dist'));

var Pin = require('../database').pin;

// Dynamic port for Heroku deployment
var port = process.env.PORT || 3000;

// Heroku requires the root route though express offers the route without definition
app.get('/', function (req, res) {
  res.status(200).sendFile('index.html');
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

app.get('/markers/:loc', require('./controllers/markers'));

app.get('/sendClosestPlaylist', function (req, res) {
  var params = req.url.slice(21).split('=');
  var lng = JSON.parse(params[0]);
  var lat = JSON.parse(params[1]);

  db.getPinsWithinRadius(lng, lat, function(err, data){
    var closestPin = [];

    for (var k = 0; k < data.length; k++ ) {
      // find nearest pin
      var a = Math.abs(lng - data[k].location.coordinates[0]);
      var b = Math.abs(lat - data[k].location.coordinates[1]);
      var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
      closestPin.push(c);
    }
      var min = Math.min.apply(Math, closestPin);
      var index = closestPin.indexOf(min);
      // send playlist back to client
      res.send(data[index].playlistUrl);
  })
});

// add new pin to DB
app.post('/newpin', function(req, res) {
 var pinData = {
   location: { type: 'Point', coordinates: [ Number(req.body.location.coordinates[0]), Number(req.body.location.coordinates[1]) ] },
   playlistUrl: req.body.playlistUrl,
   playlistName: req.body.playlistName
 }
  // var parsedBody = JSON.parse(req.body);
  Pin.create(pinData, function(err) {
    if (err) {
      console.error(err);
    } else {
      res.end();
    }
  })
})

/// =========================== SPOTIFY ======================

// setup the url for the Heroku or for the development
var env = process.env.NODE_ENV || 'local';
var redirect_uri = env === 'local' ? 'http://localhost:3000/callback/' : 'https://geo-music-staging.herokuapp.com/callback/';

// choose between env variables for Heroku or dev env
var client_id = process.env.CLIENT_ID || secret.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET || secret.CLIENT_SECRET; // Your secret

// working code: getting token and playlists of a user (user_id is hardcoded right now)
var user_id = 'annagzh';
app.get('/getTokenAndPlaylists', function(req, res) {
  //'Authorization': 'Basic ZjQ5ZjY0OWYyMTQwNDY5NjkzY2ZjOTU2ZWU0ZWRlOGQ=:ZDg1ZTI2ZWFjODk2NDYzOGFjMjE2N2FiOGUwN2FhMjE='

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {

    const options = {
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + body.access_token
      }
    };

    request(options, function(err, response, body) {
      if (err) {
        console.error(err);
      } else {
        var parsedBody = JSON.parse(body)
        res.send(parsedBody.items)
      }
    });
  })
})