module.exports = function(req, res) {
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
}