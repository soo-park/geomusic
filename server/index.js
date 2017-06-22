var express = require('express');
var bodyParser = require('body-parser');
var items = require('../database');

var app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.get('/heroku', function (req, res) {
  res.send('hello world')
})

app.get('/items', function (req, res) {
  items.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

// Dynamic port for Heroku deployment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('listening on port ' + port);
});

module.exports = app;
