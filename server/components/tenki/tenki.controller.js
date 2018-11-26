const request = require('request');
const redisClient = require('../../helpers/redis-client');
const config = require('../../config/config');
const DarkSky = require('dark-sky');
const darksky = new DarkSky(config.dark_sky_api_key);


// Set key expiration on 1 hour basis (i.e., 3600 seconds),
// so the DarkSky data can be queried each hour
const cacheExpirationPolicyTime = 3600;


// Flag to know if data was found on cache
var cachedDataFound = false;



/**
 * Get tenki (weather in japanese) forecast by location coordinates
 *
 * @param {Object} req    Request object
 * @param {Object} res    Response object
 * @param {Object} next   Next object
 *
 * @property {string} req.body.latitude - Latitude coordinate
 * @property {string} req.body.longitude - Longitude coordinate
 *
 * @returns {application/json}
 */
function getForecastByLocation(req, res, next) {

  // Make requests to get weather data for location
  getCountry(req.body.latitude, req.body.longitude)
    .then(data => getCapital(data))
    .then(data => getDarSkyForecast(data, req))
    .then(data => getCountrySeason(data))
    .then(data => cacheStoreByCountry(data))
    .then(data => res.json({status: 'ok', message: '', data: data}))
    .catch(error => res.json({status: 'error', error_msg: error, data: {}}));
}



/**
 * Get country data from Google Maps by reverse geocoding
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
          try {

            // Get country ISO code
            var isoCode = body.results[0].address_components[0].short_name;


            // Check if the data for the country is already cached and returns it if it's found
            cacheGetByCountry(isoCode)
              .then(data => {

                if (data) {
                  cachedDataFound = true;
                  console.log(`cachedDataFound for 'country-${isoCode}'`, data);

                } else {
                  // Data not cached yet

                  data = {
                    'country' : {
                      'name' : body.results[0].address_components[0].long_name,
                      'isoCode' : body.results[0].address_components[0].short_name,
                      'latitude' : body.results[0].geometry.location.lat,
                      'longitude' : body.results[0].geometry.location.lng,
                    }
                  }
                }

                resolve(data);
              })
              .catch(error => {
                throw new Error(error);
              });


          } catch (e) {

            reject(`Country data cannot be retrieved. Reason: Bad response (${e.message})`)
            return
          }

        }
    );

  })

}



/**
 * Get capital data from Google Maps
 *
 * @param  {Object} data    Contains country latitude and longitude
 *
 * @return {Promise}
 */
function getCapital(data) {

  // Gets country capital by country ISO code
  var restCountriesApiUrl = `https://restcountries.eu/rest/v2/alpha/${data.country.isoCode}`;

  return new Promise(function(resolve, reject) {

    // Skip promise if data was found on cache
    if (cachedDataFound) {
      resolve(data);
      return;
    }


    request(
        { url: restCountriesApiUrl, json: true, timeout: config.request_timeout },
        (err, res, body) => {

          // Handle errors
          if (err) {
            reject(`Capital data cannot be retrieved. Reason: ${err}`)
            return
          }

          // RestCountries returns 400 status code when no data is found
          if (res.statusCode !== 200) {
            reject(`Capital data cannot be retrieved. Response: ${res.statusCode} ${res.statusMessage}`)
            return
          }

          // Send request to get country capital latitude and longitude
          // Also, resolves/rejects promise
          getCapitalData(data, body, resolve, reject);
        }
    );

  })

}


/**
 * Makes request to Google Maps to retrieve country capital data
 *
 * @param  {string} latitude      Request latitude
 * @param  {string} longitude     Request longitude
 *
 * @return {Promise}
 */
function getCapitalData(data, responseBody, resolve, reject) {

  // There are countries that doesn't have capital (eg: AQ (Antarctica), UM, BV)
  // In this scenarios, returns country data latitude and longitude as default data
  //
  // @see http://country.io/capital.json
  // @see https://developers.google.com/public-data/docs/canonical/countries_csv
  // @see https://restcountries.eu/#api-endpoints-code
  // @see https://restcountries.eu/rest/v2/alpha/UM
  if (!responseBody.capital) {

    var capitalData = {
        'capital' : {
          'name' : 'not-found',
          'latitude' : data.country.latitude,
          'longitude' : data.country.longitude
        }
      };

    var responseData = {
      ...data,
      ...capitalData
    }

    resolve(responseData);
    return
  }


  // Request capital data on Google Maps by geocoding
  var gmapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${responseBody.capital}&result_type=city&key=${config.gmaps_api_key}`;
  request(
      { url: gmapsApiUrl, json: true, timeout: config.request_timeout },
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

        // Gmaps returns "OK" when it founds results
        if (body.status != 'OK') {
          reject(`Capital data cannot be retrieved. Reason: No results found`)
          return
        }


        // Return response
        try {

          var capitalData = {
            "capital" : {
              'name' : body.results[0].address_components[0].long_name,
              'latitude' : body.results[0].geometry.location.lat,
              'longitude' : body.results[0].geometry.location.lng
            }
          }

          var responseData = {
            ...data,
            ...capitalData
          }

          resolve(responseData);


        } catch (e) {
          reject(`Capital data cannot be retrieved. Reason: Bad response (${e.message})`)
          return
        }
      }
  );

}



/**
 * Get Dark Sky forecast for country capital
 *
 * @param  {Object} data    Contains country capital latitude and longitude
 * @param  {Object} req     Request object
 *
 * @return {Promise}
 */
function getDarSkyForecast(data, req) {

  const time = req.body.time ? req.body.time : getTodayDate();

  return new Promise(function(resolve, reject) {

    // Skip promise if data was found on cache
    if (cachedDataFound) {
      resolve(data);
      return;
    }


    darksky
      .latitude(data.capital.latitude)
      .longitude(data.capital.longitude)
      // .time(time)
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


        // Return response
        try {

          var weatherData = {
              'weather' : {
                'temperature' : darkskyResponse.currently.temperature,
                'summary' : darkskyResponse.currently.summary,
                'timezone' : darkskyResponse.timezone,
                'timeEpoch' : darkskyResponse.currently.time
              }
            };

          var responseData = {
            ...data,
            ...weatherData
          };

          resolve(responseData);


        } catch (e) {
          reject(`Dark Sky forecast for country capital cannot be retrieved. Reason: Bad response (${e.message})`)
          return
        }

      })
      .catch(error_msg => {
        reject(`Dark Sky forecast for country capital cannot be retrieved. Reason: ${error_msg}`)
      });
  })

}



/**
 * Get season for a country
 *
 * @param  {Object} data    Contains country latitude and longitude
 *
 * @return {Promise}
 */
function getCountrySeason(data) {

  return new Promise(function(resolve, reject) {

    // Skip promise if data was found on cache
    if (cachedDataFound) {
      resolve(data);
      return;
    }


    try {

      var seasons;

      // Set today date to current weather time response
      // Note: ECMAScript handles time in ms, not seconds
      var today = new Date();
      today.setTime(data.weather.timeEpoch * 1000);

      // Set season order according to hemisphere
      if (data.country.latitude >= 0) {
        // North hemisphere
        seasons = ['summer', 'autumn', 'winter', 'spring'];

      } else {
        // South hemisphere
        seasons = ['winter', 'spring', 'summer', 'autumn'];
      }


      // Get current season and return response
      data.weather.season = seasons[Math.floor((today.getMonth() / 12 * 4)) % 4];
      resolve(data);

    } catch (e) {
      reject(`Country season cannot be retrieved. Reason: Bad response (${e.message})`)
      return
    }

  })

}


/**
 * Get today date on Y-m-d format
 *
 * Note: today date comes from local machine where this code is executed
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



/**
 * Get cached data on Redis for the location specified
 *
 * @param  {string} countryISOCode      Location country ISO code
 *
 * @return Promise
 */
function cacheGetByCountry(countryISOCode) {

  var key = `country-${countryISOCode}`;

  return new Promise(function(resolve, reject) {
    resolve(redisGet(key)); // waits for redisGet to resolve
  });
}


/**
 * Set cached data on Redis for the location specified
 *
 * @param  {string} countryISOCode      Location country ISO code
 *
 * @return Promise
 */
function cacheStoreByCountry(data) {

  var key = `country-${data.country.isoCode}`;

  return new Promise(function(resolve, reject) {
    redisSet(key, data); // async
    resolve(data);
  });
}


/**
 * Get key on Redis cache
 *
 * @param  {string} key   Cache key
 *
 * @return Promise
 */
async function redisGet(key) {
  const rawData = await redisClient.getAsync(key);

  var data;
  try {
    data = JSON.parse(rawData);

  } catch (e) {
    data = null;
  }

  return data;
}


/**
 * Set key/value pair on Redis cache
 *
 * @param  {string} key     Cache key
 * @param  {mixed} value    Value
 * @param
 *
 * @return Object|null
 */
async function redisSet(key, value, callback) {

  if (typeof value == 'object') {
    value = JSON.stringify(value);
  }

  await redisClient.setexAsync(key, cacheExpirationPolicyTime, value);

  return true;
}



module.exports = { getForecastByLocation };
