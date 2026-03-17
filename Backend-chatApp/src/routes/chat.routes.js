const router = require("express").Router();
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require('../middlewares/auth.middleware')
const {sendMessage,getMyChats,getMessages,markSeen
    ,deleteMessage,editMessage,forwardMessage,reactMessage,markDelivered} = require("../controllers/chat.controller")


router.post("/send", authMiddleware, upload.single("file"), sendMessage);

router.get("/get-chat", authMiddleware, getMyChats);

router.get("/get-allMes/:conversationId", authMiddleware, getMessages);

router.put("/seen/:messageId", authMiddleware, markSeen);

//message delete api
router.delete("/dlt-message", authMiddleware, deleteMessage);

router.put("/message/edit", authMiddleware, editMessage);

router.post("/message/react", authMiddleware, reactMessage);

//markdeliver
router.post("/message/:messageId/delivered", authMiddleware, markDelivered);

module.exports = router