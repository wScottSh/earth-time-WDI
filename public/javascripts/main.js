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
      latitude = 30.2672,
      longitude = -97.7431

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

console.log(earthTimeEpoch);

function EarthTimeConverter () {

}

const converter = new EarthTimeConverter()

console.log(converter);
