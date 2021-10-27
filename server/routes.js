const express = require("express");

const router = express.Router();

const { contactModel, isValidId } = require("./models/contact");

// get all contacts
router.post("/", async (req, res) => {
  const search = req.body.search;

  const filter = {
    firstName: { $regex: search || "", $options: "i" },
  };

  const contacts = await contactModel.find(filter);

  res.json(contacts);
});

// get contact by id
router.get("/:id", async (req, res) => {
  try {
    const contactId = req.params.id;

    // check if contactId is valid mongoose id
    if (!isValidId(contactId)) {
      return res.status(400).json({
        error: "Invalid contact id",
      });
    }

    const contact = await contactModel.findById(contactId);

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error });
  }
});
//adding contacts and it has verification purposes if the user does not enter a name, last name, email or phone number as they're requ
router.post("/add", async (req, res) => {
  try {
    const input = req.body;

    // require these fields to be provided
    if (!input.firstName || !input.lastName || !input.email || !input.phone) {
      return res.status(400).json({
        error: "Please fill out all fields",
      });
    }

    const newContact = new contactModel({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,

      // only add image if it's provided
      ...(input.image && { image: input.image }),
    });

    await newContact.save();

    res.json({
      success: true,
      message: "Contact added successfully",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// update the contact
router.put("/:contactId", async (req, res) => {
  try {
    const contactId = req.params.contactId;

    // check if contactId is valid mongodb ObjectId
    if (!isValidId(contactId)) {
      return res.status(400).json({
        error: "Invalid contact id",
      });
    }

    let input = {};

    // loops through the request body and updates the contact accordingly,
    // if the field is empty, it will not be updated
    for (const [key, value] of Object.entries(req.body)) {
      if (key && value) input[key] = value;
    }

    await contactModel.findByIdAndUpdate(contactId, input);

    res.json({ success: true, message: "Contact updated successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// deletes the contact based on their ID
router.delete("/:contactId", async (req, res) => {
  try {
    const contactId = req.params.contactId;

    if (!isValidId(contactId)) {
      return res.status(400).json({
        error: "Invalid contact id",
      });
    }

    // delete the contact from the database
    await contactModel.findByIdAndDelete(contactId);

    return res.json({
      success: true,
      message: "Contact removed successfully",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
