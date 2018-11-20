const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);


router.get('/error', function(req, res, next) {
  // here we cause an error in the pipeline so we see express-winston in action.
  return next(new Error("This is an error and it should be logged to the console"));
});


module.exports = router;
