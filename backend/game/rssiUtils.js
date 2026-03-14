'use strict';

// Convert distance → RSSI signal strength
function distanceToRSSI(distance) {
  const txPower = -59; // typical BLE signal strength at 1m
  const n = 2; // signal propagation constant

  if (distance <= 0) return txPower;

  return txPower - (10 * n * Math.log10(distance));
}

// Convert RSSI → approximate distance
function rssiToDistance(rssi) {
  const txPower = -59;
  const n = 2;

  return Math.pow(10, (txPower - rssi) / (10 * n));
}

module.exports = {
  distanceToRSSI,
  rssiToDistance,
};