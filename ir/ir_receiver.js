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
var infraredlib = require('ir-attx4');
var infrared = infraredlib.use(tessel.port['B']);

var carLocked = true;

// If we get data, print it out
infrared.on('data', function(data) {
  var dataArray = data.toJson();
  if (dataArray[0] === "34") {
    if (carLocked) {
      carLocked = false;
      console.log("Car Unlocked!");
    } else {
      carLocked = true;
      console.log("Car Locked!");
    }
  }
});
