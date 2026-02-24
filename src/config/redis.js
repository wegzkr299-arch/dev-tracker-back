const Redis = require("ioredis")

const redis = new Redis({
  host: "full-dane-41103.upstash.io",
  port: 6379,
  password: "AaCPAAIncDIyYTc3YWVkYjQ1YmQ0YmY4YTM0NThiYzMzZTNkMTQ4MHAyNDExMDM", // حط التوكن بتاعك هنا
  tls: {} // مهم لأنه مفعل SSL/TLS
})

redis.on("connect", () => {
  console.log("✅ Redis connected")
})

redis.on("error", (err) => {
  console.error("❌ Redis error:", err)
})

module.exports = redis