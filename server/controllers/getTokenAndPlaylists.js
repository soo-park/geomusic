var secret = require('../../secret.js'); // for development only: not for deployment

module.exports = function(req, res) {

  // setup the url for the Heroku or for the development
  var env = process.env.NODE_ENV || 'local';
  var redirect_uri = env === 'local' ? 'http://localhost:3000/callback/' : 'https://geo-music-staging.herokuapp.com/callback/';

  // choose between env variables for Heroku or dev env
  var client_id = process.env.CLIENT_ID || secret.CLIENT_ID; // Your client id
  var client_secret = process.env.CLIENT_SECRET || secret.CLIENT_SECRET; // Your secret
  var user_id = 'greenfield8080';

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
}