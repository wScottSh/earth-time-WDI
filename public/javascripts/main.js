const express = require('express');
const epoch = require('unix-timestamp');
const SunCalc = require('suncalc');
const app = express();

console.log("main.js sanity check");

const now = epoch.now(),
      avgDay = 86400,
      yesterday = now - avgDay,
      tomorrow = now + avgDay,
      solarTimes = SunCalc.getTimes(now, -48.876667, -123.393333)

const moonPhase = SunCalc.getMoonIllumination(now)

console.log(now);
console.log(yesterday);
console.log(tomorrow);
console.log(solarTimes);
console.log(moonPhase);
