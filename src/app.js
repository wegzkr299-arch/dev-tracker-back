const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimite = require("express-rate-limit");
const dbConnection = require("./config/db");
const regRouter = require("./modules/auth/routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const { projectRouter } = require("./modules/auth/routes/project.routes");
const app = express();
const port = 4200;
app.set('trust proxy', 1)
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:4200',
      'http://localhost:55676'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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
app.use('/developer' , projectRouter);
app.use(errorMiddleware);



app.listen(port, () => {
  console.log("server running");
});

dbConnection();
