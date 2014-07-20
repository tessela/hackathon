var express = require('express');
var app = express();

app.listen(5000, function () {
  console.log('Listening on port 5000');
});

app.set('base url', process.env.BASE_URL || 'http://localhost');
app.use(express.static(__dirname + '/'));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if ('OPTIONS' === req.method) {
    res.send(200);
    return;
  }
  next();
});

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

var locked = true;

app.get('/lock', function (req, res) {
  console.log('Car locked!');
  locked = true;
  res.send('Car locked!');
});

app.get('/unlock', function (req, res) {
  console.log('Car unlocked!');
  locked = false;
  res.send('Car unlocked!');
});

app.get('/lockedState', function (req, res) {
  console.log('Checking locked state');
  res.send(locked);
});