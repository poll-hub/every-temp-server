const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const initializeSocket = require("./src/sockets");

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

initializeSocket(io); // Socket.IO 핸들러 초기화

const users = require("./src/routes/users");
const rooms = require("./src/routes/rooms");

app.use("/api/v1/users", users);
app.use("/api/v1/rooms", rooms);

module.exports = app;
