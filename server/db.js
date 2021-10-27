const mongoose = require("mongoose");

const uri =
  "mongodb+srv://JamalCzar:KN869^!-293497@cluster0.fxl0m.mongodb.net/address_book?retryWrites=true&w=majority";

//connect to the database
const initDatabase = async () => {
  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch(() => {
      console.log("Connection failed");
    });
};

module.exports = { initDatabase };
