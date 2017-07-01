/// ===================== BOILER PLATE DEPENDENCIES ===================

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var bodyParser = require('body-parser');
// var secret = require('../secret.js')
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
var db = require('../database');
// req.body has to have current location of a user
app.get('/sendClosestPlaylist', function (req, res) {
  // console.log('params', params);
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
// console.log('data in /sendClosestPlaylist:', data);
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

// module.exports = app;



/// =========================== SPOTIFY DEPENDENCIES ======================

var request = require('request');
// "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

/// =========================== SPOTIFY app helper =============================
/*
 * This is a node.js script that performs the Authorization Code oAuth2
 * flow to authenticate against the Spotify Accounts.
 * to use this file correctly, generate secret.js file in root, and put the
 * following string in your file
 *
 * module.exports.CLIENT_ID='your client ID';
 * module.exports.CLIENT_SECRET='your client secret';
 * module.exports.REDIRECT_URI=
 * 'http://localhost:3000/callback/'
 * https://geo-music.herokuapp.com/
 * and make sure you add the http://localhost:3000/callback/ to your white list
 * in spotify
*/
//  =========================== API secrets  ===========================

// FIXME: refactor to dynamically change according to local/testing/staging/production

// for development only: not for deployment
// var secret = require('../secret.js');

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
          // console.log(body);
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
      console.log(body);
    });
  }
});

// =================== SPOTIFY Data Retrieval =========================
// GET https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

var TEMP_TOKEN = process.env.TEMP_TOKEN || 'BQA70B6cLxC3wkaoywx4UlLgFhwLK_hzJF-UDu_RTRITksgCobSflpZSQ0CsMgDSXlo8AFZglIE56Du9_c0tapT8JUj6WIPEh8UBq4zV_d6bh0EpN2iL-tPQCTkO9VPgNVXCg9n6HxaiA3fWYXguL7QBig02xtI&refresh_token=AQDg6R1wmMLUILDLZwdEtJs3-sVLl-9LwYauFs0_uVrZm6zCjMk_cdEO3Z_KRbEmsxyVCQMlVKiV-rpM9ahBOoxeNrVpVf2eeDZiTRYSreuI3IqbI1jBNFQae3nMNgF226M'
var SPOTIFY_ACCESS_TOKEN;
var SPOTIFY_REFRESH_TOKEN;
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


module.exports.getAllPlayList = getAllPlayList;
module.exports = app;
