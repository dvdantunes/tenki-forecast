const express = require('express');
const tenki = require('./components/tenki/tenki.controller');


const router = express.Router(); // eslint-disable-line new-cap


/** POST /tenki-forecast - Get forecast data */
router.post('/tenki-forecast', tenki.getForecastByLocation);



/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);


/** GET /error - Throws an error to test express-winston */
router.get('/error', function(req, res, next) {
  return next(new Error("This is an error and it should be logged to the console"));
});




module.exports = router;
