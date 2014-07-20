// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This Bluetooth Low Energy module demo scans
for nearby BLE peripherals. Much more fun if
you have some BLE peripherals around.
*********************************************/

var tessel = require('tessel');
var blelib = require('ble-ble113a');
var infraredlib = require('ir-attx4');

var ble = blelib.use(tessel.port['A']);
var infrared = infraredlib.use(tessel.port['B']);

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

ble.on('discover', function(peripheral) {
  var rssi = peripheral.rssi;
  // console.log('Discovered peripheral!', peripheral.toString());
  // console.log(rssi);
  if (rssi > -50 && locked === true) {
    locked = false;
    console.log('Car unlocked!');
    sendIrSignal();
  } else if (rssi < -70 && locked === false) {
    locked = true;
    console.log('Car locked!');
    sendIrSignal();
  }
  ble.stopScanning(function (err) {
    // console.log('Stopped scanning');
    if (err) { console.log('Scan stop error', err); }
    ble.startScanning({
      allowDuplicates: false,
      serviceUUIDs: ['1111']
    }, function (err){
      // console.log('Started scanning');
      if (err) { console.log('Scan error',error); }
    })
  });
});

// When we're connected
function sendIrSignal() {
  if (!err) {
    console.log("Connected to IR!");
    // Start sending a signal every three seconds
    // Make a buffer of on/off durations (each duration is 16 bits)
    var powerBuffer = new Buffer([0, 178, 255, 168, 0, 12, 255, 246, 0, 13, 255, 225, 0, 13, 255, 224, 0, 12, 255, 246, 0, 12, 255, 246, 0, 13, 255, 247, 0, 13, 255, 247, 0, 13, 255, 224, 0, 12, 255, 224, 0, 13, 255, 247, 0, 13, 255, 224, 0, 12, 255, 246, 0, 12, 255, 246, 0, 12, 255, 246, 0, 12, 255, 246, 0, 13, 255, 247, 0, 13, 255, 224, 0, 12, 255, 224, 0, 13, 255, 225, 0, 13, 255, 224, 0, 12, 255, 246, 0, 12, 255, 246, 0, 13, 255, 247, 0, 13, 255, 247, 0, 13, 255, 246, 0, 12, 255, 246, 0, 12, 255, 246, 0, 12, 255, 246, 0, 12, 255, 224, 0, 13, 255, 224, 0, 12, 255, 224, 0, 12, 255, 224]);
    // Send the signal at 38 kHz
    infrared.sendRawSignal(38, powerBuffer, function(err) {
      if (err) {
        console.log("Unable to send signal: ", err);
      } else {
        console.log("Signal sent!");
      }
    });
  } else {
    console.log(err);
  }
}
