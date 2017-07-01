module.exports = function(req, res) {

  var user_id = process.env.CLIENT_ID || 'wizzler'; // Your client id
  var access_token = process.env.ACCESS_TOKEN || secret.TEMP_TOKEN;

  getAllPlayList(user_id, access_token)
  .then((response) => {

    console.log(response);
    res.status(200).send('OK');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('NOT OK');
  });
}