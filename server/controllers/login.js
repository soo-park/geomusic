var generateRandomString = require('../helpers/generateRandomString');

module.exports = function(req, res) {

  var secret = require('../../secret.js')// for development only: not for deployment
  var querystring = require('querystring');
  var cookieParser = require('cookie-parser');
  var env = process.env.NODE_ENV || 'local';
  var redirect_uri = env === 'local' ? 'http://localhost:3000/callback/' : 'https://geo-music-staging.herokuapp.com/callback/';
  var client_id = process.env.CLIENT_ID || secret.CLIENT_ID;

  // use the random string to set state of the auth
  var stateKey = 'spotify_auth_state';

  // put { StateKey : state } into the cookie
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // passes query string spotify authorization url and redirect it to callback route
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
}