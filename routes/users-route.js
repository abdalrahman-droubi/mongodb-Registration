const express = require("express");
const router = express.Router();
const usersControllers = require('../controllers/usersControllers')

router.post("/addUser", usersControllers.addNewUser);
router.post("/login",usersControllers.login);
router.get("/getUser", usersControllers.getData);
router.get("/userType", usersControllers.verifyToken);

module.exports = router;