const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const dbConnection = () => {
    console.log("Mongo URL:", process.env.MONGO_URL);

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("database is connected");
    })
    .catch((err) => console.log(err, "error in connection database"));
};

module.exports = dbConnection;  
