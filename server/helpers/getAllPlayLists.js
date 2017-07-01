module.exports = (client_id, access_token) => {

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
