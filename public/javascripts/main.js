const express = require('express');
const epoch = require('unix-timestamp');
const SunCalc = require('suncalc');
const app = express();

console.log("main.js sanity check");

const now = epoch.now()
const yesterday = Date()
const times = SunCalc.getTimes(now, -48.876667, -123.393333)

const moonPhase = SunCalc.getMoonIllumination(now)

console.log(now);
console.log(times);
console.log(moonPhase);
