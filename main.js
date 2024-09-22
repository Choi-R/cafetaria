require('dotenv').config()
const express = require('express');
// const redis = require('redis');
const app = express();
app.use(express.json());

// const client = redis.createClient();
//client.on('error', (err) => {
//  console.log('Redis error:', err);
// });
const requestCounts = {}; // redis alternative
const rateLimitWindowMs = 30 * 1000; // 30 seconds
const maxRequests = 20; // Max requests per IP per windowMs

const rateLimiter = async (req, res, next) => {
  const userId = req.ip;
  const currentTime = Date.now();
  const windowStart = currentTime - rateLimitWindowMs;

  if (!requestCounts[userId]) {
    requestCounts[userId] = { count: 0, startTime: currentTime };
  }
  const requestData = requestCounts[userId];

  try {
    // const requestCount = await client.get(userId);
    // if (!requestCount) {
    //   await client.set(userId, JSON.stringify({ count: 1, startTime: currentTime }), 'PX', rateLimitWindowMs);
    //   return next();
    // }

    // const requestData = JSON.parse(requestCount);

    if (requestData.startTime < windowStart) {
      // await client.set(userId, JSON.stringify({ count: 1, startTime: currentTime }), 'PX', rateLimitWindowMs);
      requestData.count = 0;
      requestData.startTime = currentTime;
    }
    else if (requestData.count >= maxRequests) {
      return res.status(429).send('Too many requests, please try again later.');
      // await client.set(userId, JSON.stringify({ count: requestData.count + 1, startTime: requestData.startTime }), 'PX', rateLimitWindowMs);
    }
    requestData.count += 1; // Increment the count
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
};

// Routes
const router = require('./src/routes')
app.use('/api/v1', rateLimiter, router);

// Landing page
app.get('/', (req, res) => {
  res.send('Welcome to the Cafetaria API! Please refer to the documentation');
});
app.use((req, res, next) => {
  res.redirect(`${req.protocol}://${req.get('host')}`);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server
