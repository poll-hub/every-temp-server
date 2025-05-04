const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const port = process.env.PORT || 8000;
const app = express();

const allowedOrigins = [
  "http://localhost:3000", // 로컬 클라이언트
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.log(`MongoDB error: ${error}`));

const users = require("./src/routes/users");

app.use("/api/v1/users", users);
