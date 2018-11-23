// const express = require('express');
const DarkSky = require('dark-sky')
const darksky = new DarkSky(process.env.DARK_SKY)


/**
 * Get dark sky forecast by location coordinates

 * @property {string} req.body.latitude - Latitude coordinate
 * @property {string} req.body.longitude - Longitude coordinate

 * @returns {application/json}
 */
function getForecastByLocation(req, res, next) {

  const time = req.body.time ? req.time : getTodayDate();

  darksky
    .latitude(req.body.latitude)
    .longitude(req.body.longitude)
    // .time(time)
    .units('si')
    .language('en')
    .exclude('minutely,hourly,daily')
    .timeout(process.env.DARK_SKY_TIMEOUT)
    .get()
    .then(darkskyResponse => res.json({status: 'ok', message: '', data: darkskyResponse}))
    .catch(error_msg => res.json({status: 'error', error_msg: error_msg, data: {}}))
}


/**
 * Get today date on Y-m-d format
 *
 * Note: today date comes from local machine where this
 * code is executed
 *
 * @returns {string}
 */
function getTodayDate() {

  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }

  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}


module.exports = { getForecastByLocation };
