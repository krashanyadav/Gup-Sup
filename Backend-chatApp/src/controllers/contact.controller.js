const User = require("../models/user.model");
const Contact = require("../models/contact.model");

// ADD CONTACT BY EMAIL
 async function addContact (req, res){
  try {
    const { email } = req.body;

    const contactUser = await User.findOne({ email });

    if (!contactUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (contactUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot add yourself",
      });
    }

    // already added check
    const exists = await Contact.findOne({
      user: req.user._id,
      contact: contactUser._id,
    });

    if (exists) {
      return res.status(400).json({
        message: "Contact already added",
      });
    }
//.......add new contact in your chat  ....................
    const newContact = await Contact.create({
      user: req.user._id,
      contact: contactUser._id,
    });

    res.status(201).json({
      message: "Contact added",
      contact: newContact,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add contact",
    });
  }
};

// get my contacts

async function getMyContacts(req, res){
  try {
    const contacts = await Contact.find({ user: req.user._id })
      .populate("contact", "username email avatar about lastSeen online");

    res.status(200).json({
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get contacts",
    });
  }
};



// remove my contact
// REMOVE CONTACT
async function removeContact(req, res) {
  try {
    const { contactId } = req.params; // URL se us user ki ID lenge jise hatana hai

    // deleted user wahi hona chahiye jo current user ki list mein ho
    const deleted = await Contact.findOneAndDelete({
      _id: contactId,
      user: req.user._id, // Aapka ID
         // Jisey remove karna hai
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Contact not found in your list",
      });
    }

    res.status(200).json({
      message: "Contact removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove contact",
    });
  }
}

module.exports = { addContact, getMyContacts, removeContact };


 //post.("/api/contacts/add")
//get.("/api/contacts/get-myContact")