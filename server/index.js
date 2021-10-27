const cors = require("cors");
const express = require("express");
const { initDatabase } = require("./db");

const port = 1337;

// Initialize database
initDatabase();

// Initialize the app
const app = express();

// Enable Cross Origin Requests for all requests,
// allowing the server to be accessed from any origin
app.use(cors());

// Allows json to be sent and received
app.use(express.json());

// // Load the routes
const contactRoutes = require("./routes");

// Setup the contacts routes
app.use("/contacts", contactRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

