const request = require('request');
const DarkSky = require('dark-sky');
const config = require('../../config/config');
const darksky = new DarkSky(config.dark_sky_api_key);


/**
 * Get dark sky forecast by location coordinates

 * @property {string} req.body.latitude - Latitude coordinate
 * @property {string} req.body.longitude - Longitude coordinate

 * @returns {application/json}
 */
function getForecastByLocation(req, res, next) {

  const time = req.body.time ? req.time : getTodayDate();

  getCountry(req.body.latitude, req.body.longitude)
    .then(data => getCapital(data))
    .then(data => darskyForecast(data))
    .then(data => getSeason(data))
    .then(data => res.json({status: 'ok', message: '', data: data}))
    .catch(error_msg => res.json({status: 'error', error_msg: error_msg, data: {}}));
}


/**
 * Get country data from Google Maps
 *
 * @param  {string} latitude      Request latitude
 * @param  {string} longitude     Request longitude
 *
 * @return {Promise}
 */
function getCountry(latitude, longitude) {

  var gmapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=country&key=${config.gmaps_api_key}`;

  return new Promise(function(resolve, reject) {

    request(
        { url: gmapsApiUrl, json: true, timeout: config.request_timeout },
        (err, res, body) => {

          // Handle errors
          if (err) {
            reject(`Country data cannot be retrieved. Reason: ${err}`)
            return
          }

          if (res.statusCode !== 200) {
            reject(`Country data cannot be retrieved. Response: ${res.statusCode} ${res.statusMessage}`)
            return
          }

          // Gmaps returns "OK" when it founds results
          if (body.status != 'OK') {
            reject(`Country data cannot be retrieved. Reason: No results found`)
            return
          }


          // Return response
          try
          var data = {
            'countryData' : {
              'name' : body.results[0].address_components[0].long_name,
              'isoCode' : body.results[0].address_components[0].short_name,
              'latitude' : body.results[0].geometry.location.lat,
              'longitude' : body.results[0].geometry.location.lng,
            }
          }

          resolve(data);
        }
    );

  })

}



/**
 * Get country data from Google Maps
 *
 * @param  {string} latitude      Request latitude
 * @param  {string} longitude     Request longitude
 *
 * @return {Promise}
 */
function getCapital(data) {

  var restCountriesApiUrl = `https://restcountries.eu/rest/v2/alpha/${data.countryData.isoCode}`;

  return new Promise(function(resolve, reject) {

    request(
        { url: restCountriesApiUrl, json: true, timeout: config.request_timeout },
        (err, res, body) => {

          // Handle errors
          if (err) {
            reject(`Capital data cannot be retrieved. Reason: ${err}`)
            return
          }

          if (res.statusCode !== 200) {
            reject(`Capital data cannot be retrieved. Response: ${res.statusCode} ${res.statusMessage}`)
            return
          }

          // RestCountries
          if (body.status == '400') {
            reject(`Country data cannot be retrieved. Response: ${body.message}`)
            return
          }


          // Send request to get latitude and longitude
          // Also, resolves/rejects promise
          getCapitalData(data, body, resolve, reject);
        }
    );

  })

}


function getCapitalData(data, responseBody, resolve, reject) {

  // There are countries that doesn't have capital (eg: AQ (Antarctica), UM, BV) or
  // Returns country data latitude and longitude
  //
  // @see http://country.io/capital.json
  // @see https://developers.google.com/public-data/docs/canonical/countries_csv
  // @see https://restcountries.eu/#api-endpoints-code
  // @see https://restcountries.eu/rest/v2/alpha/UM
  if (responseBody.capital && responseBody.capital.length == 0) {

    var data = {
      ...data,
      {'capitalData' : {
        'name' : 'not-found',
        'latitude' : data.countryData.latitude,
        'longitude' : data.countryData.longitude
      }}
    }

    resolve(data);
    return
  }

  var gmapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${responseBody.capital}&result_type=country&key=${config.gmaps_api_key}`;

  request(
      { url: rescountriesUrl, json: true, timeout: config.request_timeout },
      (err, res, body) => {

        getCapitalData(resolve, reject);
      }
  );
  // Handle errors
  if (err) {
    reject(`Capital data cannot be retrieved. Reason: ${err}`)
    return
  }

  if (res.statusCode !== 200) {
    reject(
      `Capital data cannot be retrieved. Response: ${res.statusCode} ${
        res.statusMessage
      }`
    )
    return
  }

  // Gmaps returns "OK" when it founds results
  if (body.status != 'OK') {
    reject(
      `Country data cannot be retrieved. No results found`
    )
    return
  }


  // Return response
  var data = {
    "countryData" : {
      'name' : body.results.0.formatted_address,
      'iso-code' : body.results.0.address_components.0.short_name,
      'latitude' : body.results.0.geometry.location.lat,
      'longitude' : body.results.0.geometry.location.lng,
    }
  }

  resolve(data);
}



/**
 * Get Dark Sky forecast for country capital
 *
 * @param  {Object} data    Contains country capital latitude and longitue
 *
 * @return {Promise}
 */
function darskyForecast(data) {

  return new Promise(function(resolve, reject) {

    darksky
      .latitude(data.capital.latitude)
      .longitude(data.capital.longitude)
      .units('si')
      .language('en')
      .exclude('minutely,hourly,daily')
      .timeout(config.request_timeout)
      .get()
      .then(darkskyResponse => {

        // Rejects if there is an error or if there is no data
        if (typeof darkskyResponse == 'string') {
          reject(`Dark Sky forecast for country capital cannot be retrieved. Reason: ${darkskyResponse}`)
          return
        }

        if (darkskyResponse.error || !darkskyResponse.currently) {
          var error = darkskyResponse.error ? darkskyResponse : 'No data found';
          reject(`Dark Sky forecast for country capital cannot be retrieved. Reason: ${error}`)
          return
        }

        // Prepares response data
        var data = {
          ...data,
          {"weather" : {
            "temperature" : darkskyResponse.currently.temperature,
            "summary" : darkskyResponse.currently.summary,
            "timezone" : darkskyResponse.timezone
          }}
        }

        resolve(data);
      })
      .catch(error_msg => {
        reject(error_msg)
      });
  })

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
