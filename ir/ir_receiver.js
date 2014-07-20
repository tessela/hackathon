// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This infrared module example transmits the
power signal sequence of an Insignia brand
television every three seconds, while also
listening for (and logging) any incoming
infrared data.
*********************************************/

var tessel = require('tessel');
var http = require('http');
var infraredlib = require('ir-attx4');
var infrared = infraredlib.use(tessel.port['B']);

var carLocked = true;

function postRequest (path) {
  console.log('requesting');
  http.get("http://tessela.azurewebsites.net/" + path, function(res) {
    console.log("Got response: " + res.statusCode);
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

// If we get data, print it out
infrared.on('ready', function(err) {
  if (err) { console.log('IR error', err); }
  console.log('IR receiver ready!');
  postRequest('unlock');
  infrared.on('data', function(data) {
    var dataArray = data.toJSON();
    console.log(dataArray.length);
    if (dataArray.length === 132) {
      if (carLocked) {
        carLocked = false;
        console.log("Car Unlocked!");
        postRequest('unlock');
      } else {
        carLocked = true;
        console.log("Car Locked!");
        postRequest('lock');
      }
    }
  });
});