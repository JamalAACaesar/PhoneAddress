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

/**
 * next thing we gotta do is prepare this server to work in the cloud
 * 
 * we're going to deploy it using this, https://cloud.google.com/run
 * 
 * so gwaan on de page, press get started nd signup for a free account. you gon have to attach your card but they have a free tier
*/
