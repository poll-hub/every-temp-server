const express = require("express");

const router = express.Router();

const ctrl = require("./users.ctrl");

router.post("/login", ctrl.post.login); // 로그인

module.exports = router;
