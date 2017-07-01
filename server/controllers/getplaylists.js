module.exports = function(req, res) {
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
}