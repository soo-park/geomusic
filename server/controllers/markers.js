var db = require('../database');

//  URL Should be in format `/markers/@${latitude},${longitude}`

// This route needs to be added to server for markers to work
//app.get('/markers/:loc', require('./markers'));
module.exports = function(req, res) {
  if (req.params.loc[0] !== '@') {
    res.status(400).send('url format should be `@${latitude},${longitude}`')
  } else {
    var lat = parseFloat(req.params.loc.slice( 1, req.params.loc.indexOf(',') )); 
    var lng = parseFloat(req.params.loc.slice( req.params.loc.indexOf(',') + 1 ));

    db.getPinsWithinRadius(lng, lat, function(err, markers) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(markers); 
      }
    });
  }
};
