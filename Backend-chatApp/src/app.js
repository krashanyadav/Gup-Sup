const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const userRoutes = require('../src/routes/user.route')
const chatRoutes = require("../src/routes/chat.routes")
// contact route
const contactRoutes = require("./routes/contact.routes");
// const chatRoutes = require("./routes/chat.routes");
// const messageRoutes = require("./routes/message.routes");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
// app.use(cors());

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? "https://gup-supnextchat.onrender.com"
    : "http://localhost:5173",
  credentials: true
}));
app.use(express.json());


//for token
const cookieParser = require("cookie-parser");
app.use(cookieParser());
 

// API prefix
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes)
//contacts
app.use("/api/contacts", contactRoutes);
//chatRote
app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);

module.exports = app;