const mongoose = require("mongoose");

// Checks is the given object id is valid
const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

//This is schema of a contact in the database
const schema = new mongoose.Schema({
  image: {
    type: String,
    required: false,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  },

  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  // use regex to validate valid email format
  email: { type: String, required: true, validate: /^\S+@\S+\.\S+$/ },

  // use regex to validate valid phone number format
  phone: { type: String, required: true, validate: /\d{3}-\d{3}-\d{4}/ },
});

const contactModel = mongoose.model("Contact", schema);

module.exports = { contactModel, isValidId };
