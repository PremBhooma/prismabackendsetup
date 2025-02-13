const express = require("express");
const router = express.Router();

const controller = require("../controllers/postController");

router.post("/create", controller.createPost);
router.get("/get-all-posts", controller.getPosts);

module.exports = router;
