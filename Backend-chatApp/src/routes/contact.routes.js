const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  addContact,
  getMyContacts,
  removeContact
} = require("../controllers/contact.controller");

const router = express.Router();

router.post("/add", authMiddleware, addContact);
router.get("/get-myCont", authMiddleware, getMyContacts);
router.delete("/remove/:contactId", authMiddleware, removeContact);

module.exports = router;