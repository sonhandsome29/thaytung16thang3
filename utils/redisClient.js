var createClient = require('redis').createClient;

var redisClient;
var hasLoggedRedisFailure = false;
var hasLoggedRedisReady = false;

function connectRedis() {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    socket: {
      reconnectStrategy: function (retries) {
        if (retries > 3) {
          return false;
        }

        return retries * 500;
      }
    }
  });

  redisClient.on('error', function (error) {
    if (!hasLoggedRedisFailure) {
      console.error('Redis unavailable, app will continue without cache:', error.message);
      hasLoggedRedisFailure = true;
    }
  });

  redisClient.on('ready', function () {
    if (!hasLoggedRedisReady) {
      console.log('Redis connected');
      hasLoggedRedisReady = true;
    }
    hasLoggedRedisFailure = false;
  });

  redisClient.connect().catch(function (error) {
    if (!hasLoggedRedisFailure) {
      console.error('Redis unavailable, app will continue without cache:', error.message);
      hasLoggedRedisFailure = true;
    }
  });

  return redisClient;
}

function getRedisClient() {
  return redisClient;
}

function isRedisReady() {
  return !!(redisClient && redisClient.isReady);
}

module.exports = {
  connectRedis: connectRedis,
  getRedisClient: getRedisClient,
  isRedisReady: isRedisReady
};
