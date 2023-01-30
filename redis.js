var redis = require('redis');
var redisClient = redis.createClient(6379, "127.0.0.1");
redisClient.on('connect', function() {
    console.log('Redis connected');
});
// redisClient.on('end', function() {
//     console.log('Redis end');
// });

// redisClient.set("name", "Test");
// redisClient.get("name", function(err, reply) {
//     console.log(reply);
//});

module.exports = redisClient;
