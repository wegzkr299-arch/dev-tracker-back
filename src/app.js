const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimite = require("express-rate-limit");
const dbConnection = require("./config/db");
const regRouter = require("./modules/auth/routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const app = express();
const port = 4200;
app.set('trust proxy', 1)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: ["http://localhost:4200"] }));
app.use(
  rateLimite({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

const testroute = (req, res) => {
  res.json({ message: "hello form test" });
};

app.get("/", testroute);
app.use('/auth', regRouter);
app.use(errorMiddleware);



app.listen(port, () => {
  console.log("server running");
});

dbConnection();
