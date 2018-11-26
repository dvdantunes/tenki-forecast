const redis = require('redis');
const {promisify} = require('util');


// Sets a new connection to Redis server on indicated host:port
const client = redis
    .createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
        no_ready_check: true
    });


// Set Redis events
client.on('connect', () => {
    console.log(`Redis connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
});

client.on("error", function (err) {
  console.log(`Redis error on ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, err);
});

client.on("end", function() {
  console.log(`Redis connection closed from ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
});



module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  setexAsync: promisify(client.setex).bind(client),
  delAsync: promisify(client.del).bind(client),
  keysAsync: promisify(client.keys).bind(client),
  quitAsync: promisify(client.quit).bind(client)
};
