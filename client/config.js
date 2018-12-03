// Google Maps Api Key
const GMAPS_API_KEY = 'AIzaSyA53AqsfawEZBHOUi2UjHfKvgi37tl7cXA';

// Tenki forecast server API entrypoint URL
// const TENKI_FORECAST_SERVER_API_URL = 'http://localhost:4040/api/tenki-forecast';
const TENKI_FORECAST_SERVER_API_URL = 'http://ec2-18-207-108-90.compute-1.amazonaws.com/api/tenki-forecast';


module.exports = { GMAPS_API_KEY, TENKI_FORECAST_SERVER_API_URL };




// Not working because of 'fs' dependency package problem that's not easy to solve:
//   * fs in ./node_modules/dotenv/lib/main.js

// // Require and configure dotenv, will load vars in .env in PROCESS.ENV
// require('dotenv').config();


// const config = {
//   NODE_ENV: process.env.NODE_ENV,
//   PORT: process.env.PORT,
//   GMAPS_API_KEY : process.env.GMAPS_API_KEY,
//   TENKI_FORECAST_SERVER_API_URL : process.env.TENKI_FORECAST_SERVER_API_URL
// };


// module.exports = config;
