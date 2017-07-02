
// setup the url for the Heroku or for the development
var env = process.env.NODE_ENV || 'local';
var redirect_uri = env === 'local' ? 'http://localhost:3000/callback/' : 'https://geo-music-staging.herokuapp.com/callback/';

// choose between env variables for Heroku or dev env
var client_id = process.env.CLIENT_ID || secret.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET || secret.CLIENT_SECRET; // Your secret

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
      // console.log(body);
    });
  }
});

// =================== SPOTIFY Data Retrieval =========================
// GET https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

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



app.get('/getAccessToken', function(req, res) {
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
    console.log(body.access_token);
    res.send(body.access_token);
  })
})

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
