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
    console.log(body.access_token);
    res.send(body.access_token);
  })
}