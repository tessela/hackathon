// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This Bluetooth Low Energy module demo scans
for nearby BLE peripherals. Much more fun if
you have some BLE peripherals around.
*********************************************/

var tessel = require('tessel');
var blelib = require('ble-ble113a');

var ble = blelib.use(tessel.port['A']);

ble.on('ready', function (err) {
  if (err) { console.log('BLE error', err); }
  console.log('Scanning...');
  ble.startScanning({
    allowDuplicates: false,
    serviceUUIDs: ['1111']  // @TODO only scan for trusted encrypted set of UUIDs
  }, function (err){
    if (err) { console.log('Scan error',error); }
  });
});

var locked = true;
var discovered = false;

setInterval(function () {
  if (!discovered && !locked) {
    locked = true;
    console.log('Car locked!');
  }
}, 1000);

ble.on('discover', function(peripheral) {
  // console.log('Discovered peripheral!', peripheral.toString());
  // console.log(peripheral.rssi);
  discovered = true;
  var rssi = peripheral.rssi;
  if (rssi > -50 && locked === true) {
    locked = false;
    console.log('Car unlocked!');
  } else if (rssi < -70 && locked === false) {
    locked = true;
    console.log('Car locked!');
  }
  ble.stopScanning(function (err) {
    // console.log('Stopped scanning');
    if (err) { console.log('Scan stop error', err); }
    ble.startScanning({
      allowDuplicates: false,
      serviceUUIDs: ['1111']
    }, function (err){
      // console.log('Started scanning');
      discovered = false;
      if (err) { console.log('Scan error',error); }
    });
  });
});