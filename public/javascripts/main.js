const express = require('express');
const epoch = require('unix-timestamp');
const SunCalc = require('suncalc');
const app = express();

console.log("main.js sanity check");

const nowEpoch = epoch.now(),
      avgDay = 86400,
      today = epoch.toDate(nowEpoch),
      yesterday = epoch.toDate(nowEpoch - avgDay),
      tomorrow = epoch.toDate(nowEpoch + avgDay),
      latitude = -48.876667,
      longitude = -123.393333

function CalcTimes (yester, tod, tom, lat, lng) {
  this.sunsetYesterday = epoch.fromDate(SunCalc.getTimes(yester, lat, lng).sunset)
  this.sunriseToday = epoch.fromDate(SunCalc.getTimes(tod, lat, lng).sunrise)
  this.solarNoon = epoch.fromDate(SunCalc.getTimes(tod, lat, lng).solarNoon)
  this.sunsetToday = epoch.fromDate(SunCalc.getTimes(tod, lat, lng).sunset)
  this.sunriseTomorrow = epoch.fromDate(SunCalc.getTimes(tom, lat, lng).sunrise)
}

const relevantTimes = new CalcTimes(yesterday, today, tomorrow, latitude, longitude)

function TodaysEpochEarthTimeStamps () {
  this.now = nowEpoch
  this.dayStart = relevantTimes.sunriseToday - ((relevantTimes.sunriseToday - relevantTimes.sunsetYesterday) / 2)
  this.solarSight = relevantTimes.sunriseToday
  this.solarNoon = relevantTimes.solarNoon
  this.solarClipse = relevantTimes.sunsetToday
  this.dayEnd = relevantTimes.sunriseTomorrow - ((relevantTimes.sunriseTomorrow - relevantTimes.sunsetToday) / 2)
}

const earthTimeEpoch = new TodaysEpochEarthTimeStamps()

function EarthTimeConverter (epoch) {
  this.now = (epoch.now - epoch.dayStart) / (epoch.dayEnd - epoch.dayStart) * 1000
  this.dayStart = (epoch.dayStart - epoch.dayStart) / (epoch.dayEnd - epoch.dayStart) * 1000
  this.solarSight = (epoch.solarSight - epoch.dayStart) / (epoch.dayEnd - epoch.dayStart) * 1000
  this.solarNoon = (epoch.solarNoon - epoch.dayStart) / (epoch.dayEnd - epoch.dayStart) * 1000
  this.solarClipse = (epoch.solarClipse - epoch.dayStart) / (epoch.dayEnd - epoch.dayStart) * 1000
  this.dayEnd = (epoch.dayEnd - epoch.dayStart) / (epoch.dayEnd - epoch.dayStart) * 1000
}

const converter = new EarthTimeConverter(earthTimeEpoch)

const clockface = (obj) => {
  console.log('@' + Math.round(obj.now));
  if (obj.now > obj.dayStart && obj.now < obj.solarSight) {
    console.log('*|@' + Math.round(obj.now) + '|@' + Math.round(obj.solarSight - obj.now) + '|^');
  } else if (obj.now > obj.solarSight && obj.now < obj.solarNoon) {
    console.log('^|@' + Math.round(obj.now - obj.solarSight) + '|@' + Math.round(obj.solarNoon - obj.now) + '|#');
  } else if (obj.now > obj.solarNoon && obj.now < obj.solarClipse) {
    console.log('#|@' + Math.round(obj.now - obj.solarNoon) + '|@' + Math.round(obj.solarClipse - obj.now) + '|-');
  } else if (obj.now > obj.solarClipse && obj.now < obj.dayEnd) {
    console.log('-|@' + Math.round(obj.now - obj.solarClipse) + '|@' + Math.round(obj.dayEnd - obj.now) + '|*');
  }
}

clockface(converter)
