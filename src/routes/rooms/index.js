const express = require("express");

const router = express.Router();

const ctrl = require("./rooms.ctrl");

router.post("/create", ctrl.post.create); // 방 만들기

module.exports = router;
