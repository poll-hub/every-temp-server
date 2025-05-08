const express = require("express");

const router = express.Router();

const ctrl = require("./users.ctrl");

router.post("/login", ctrl.post.login); // 로그인
router.post("/edit", ctrl.post.edit); // 프로필 수정

module.exports = router;
