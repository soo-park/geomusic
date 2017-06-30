/// ===================== BOILER PLATE DEPENDENCIES ===================

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var bodyParser = require('body-parser');
var db = require('../database');
// var secret = require('../secret.js')// for development only: not for deployment
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client/dist'));

/// ===================== BOILER PLATE DB ROUTE =========================

var Pin = require('../database').pin;

app.get('/pins', function (req, res) {
  pins.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

// play button get request for playlist in current location
//
// app.get('/sendClosestPlaylist', function (req, res) {
//   var params = req.url.slice(21).split('=');
//   var lng = JSON.parse(params[0]);
//   var lat = JSON.parse(params[1]);
//
//   db.getPinsWithinRadius(lng, lat, function(err, data){
//     var closestPin = [];
//
//     for (var k = 0; k < data.length; k++ ) {
//       // find nearest pin
//       var a = Math.abs(lng - data[k].location.coordinates[0]);
//       var b = Math.abs(lat - data[k].location.coordinates[1]);
//       var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
//       closestPin.push(c);
//     }
//       var min = Math.min.apply(Math, closestPin);
//       var index = closestPin.indexOf(min);
//
//       // send playlist back to client
//       res.send(data[index].playlistUrl);
//   })
// });

// add new pin to DB
app.post('/newpin', function(req, res) {
  console.log('req.body in /newpin', req.body);
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

/// =========================== SERVER RUN =============================

// Dynamic port for Heroku deployment
var port = process.env.PORT || 3000;

// Heroku requires the root route though express offers the route without definition
app.get('/', function (req, res) {
  res.status(200).sendFile('index.html');
})

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

/// =========================== SPOTIFY DEPENDENCIES ======================

// "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

/// =========================== SPOTIFY app helper =============================

// setup the url for the Heroku or for the development
var env = process.env.NODE_ENV || 'local';
var redirect_uri = env === 'local' ? 'http://localhost:3000/callback/' : 'https://geo-music-staging.herokuapp.com/callback/';

// choose between env variables for Heroku or dev env
var client_id = process.env.CLIENT_ID || secret.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET || secret.CLIENT_SECRET; // Your secret

//  ========================================================================

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      console.log('access_token', access_token);
      res.send({
        'access_token': access_token
      });
    }
  });
});


/// =========================== SPOTIFY credential helper =============================

// your application requests authorization
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
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/jmperezperez',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      // console.log(body);
    });
  }
});

// =================== SPOTIFY Data Retrieval =========================
// GET https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

var TEMP_TOKEN = process.env.TEMP_TOKEN || 'BQAyzDFCIgqYWimLvlfIZBlgeoJEK0ZL5ZJskkOfwfW9QNQY4oFgjzd5niBN-kbk9SX83zRPpRYE0V4UWJkTwWCjRQ-zepmacj4Z0G4fCk1Iis1N6lj6xsXGdd1kRTgLyUxv3gOThLblAivmUbt7k299543hOq4&refresh_token=AQCNJlh52_vDXBEznReCsiwdvH6nVo_5GyfpdbSyf1iAjiaxPF1Ka8_z3S4ydnlfdKJnDZwiFQ8_O8NBGbSS6A2jwHsZq94OpeI3cMcKIospEZJvjfQAqpUhF7xReiFIBj0'
// var user_id = process.env.CLIENT_ID || 'wizzler'; // Your client id
var user_id = 'annagzh';
app.get('/getplaylists', function(req, res) {
  const options = {
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + TEMP_TOKEN
    }
  };

  request(options, function(err, response, body) {
    if (err) {
      console.error(err);
    } else {
      var parsedBody = JSON.parse(body)
      console.log('parsedBody.items', parsedBody);
      res.send(parsedBody.items)
    }
  });
})

var getAllPlayList = (client_id, access_token) => {

  return new Promise((resolve, reject) => {

    const options = {
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + TEMP_TOKEN
      }
    };

    request(options, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        let json = JSON.stringify(body);
        resolve(json);
      }
    });

  })
};

app.post('/spotify', function(req, res) {

  var user_id = process.env.CLIENT_ID || 'wizzler'; // Your client id
  var access_token = process.env.ACCESS_TOKEN || secret.TEMP_TOKEN;

  getAllPlayList(user_id, access_token)
  .then((response) => {

    console.log(response);
    res.status(200).send('OK');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('NOT OK');
  });
})
