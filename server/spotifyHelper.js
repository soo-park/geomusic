var express = require('express'); // Express web server framework
var bluebird = require('bluebird');

console.log(bluebird);

/// =========================== SPOTIFY Playlist GET request =============================
// GET https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

// app.get('/onePlaylistTracks', function(req, res) {
//     var user_id = user_id || null;
//     var playlist_id = playlist_id || null;
//     var options = {
//       url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };

//     var options = {
//       url: 'https://api.spotify.com/v1/me',
//       headers: { 'Authorization': 'Bearer ' + access_token },
//       json: true
//     };
// });


// app.get('/allPlaylistOneUser', function(req, res) {
//     var user_id = user_id || null;
//     var 
//     var options = {
//       url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };

//     var options = {
//       url: 'https://api.spotify.com/v1/me',
//       headers: { 'Authorization': 'Bearer ' + access_token },
//       json: true
//     };
// });
