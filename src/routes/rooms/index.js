const express = require("express");

const router = express.Router();

const ctrl = require("./rooms.ctrl");

router.get("/", ctrl.get.list); // 방 전체목록
router.post("/create", ctrl.post.create); // 방 만들기

module.exports = router;
