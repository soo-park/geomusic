module.exports = function(req, res) {
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