const redis = require("../config/redis");

const MAX_ATTEMPTS = 5;          
const WINDOW_SECONDS = 15 * 60;  

const forgotPasswordLimiter = async (req, res, next) => {
  try {
    const email = req.body.email;
    const ip = req.ip;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const key = `forgot:${email}:${ip}`;

    const attempts = await redis.incr(key);

    if (attempts === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    if (attempts > MAX_ATTEMPTS) {
      return res.status(429).json({
        message: "Too many reset attempts. Try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    next();
  }
};

module.exports = forgotPasswordLimiter;