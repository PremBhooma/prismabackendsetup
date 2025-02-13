const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");

router.get("/get-all-users", controller.getUsers);
router.post("/create", controller.upload.single("imageUrl"), controller.createUser);
router.post("/login", controller.login);
router.get("/get-user-by-id/:id", controller.getUserById);
router.post("/update-user", controller.updateUser);
router.post("/delete/:id", controller.deleteUser);

module.exports = router;
