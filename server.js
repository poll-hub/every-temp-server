const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const initializeSocket = require("./src/sockets");

dotenv.config();
const port = process.env.PORT || 8000;
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";
const mongoURI = process.env.MONGO_URI;

const app = express();

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

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

initializeSocket(io); // Socket.IO 핸들러 초기화

// MongoDB 연결
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("[DB] Connected to MongoDB");
    httpServer.listen(port, () => {
      console.log(`[Server] Server listening on port ${port}`);
    });
  })
  .catch((error) => console.log(`MongoDB error: ${error}`));

const users = require("./src/routes/users");
const rooms = require("./src/routes/rooms");

app.use("/api/v1/users", users);
app.use("/api/v1/rooms", rooms);
