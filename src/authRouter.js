const Router = require('express');
const AuthController = require('./authController.js');
const { check } = require('express-validator');
// const authMiddleware = require("./middleware/authMiddleware.js");
const roleMiddleware = require("./middleware/roleMiddleware.js");

const router = new Router();


router.post("/registration", [ // указываем валидаторы для полей, которые нужно отработать
	check("username", "Имя пользователя не может быть пустым").notEmpty(),
	check("password", "Пароль должен быть больше 4 и меньше 10 символов").isLength({ min: 4, max: 10 })
], AuthController.registration);
router.post("/login", AuthController.login);
router.get("/users", roleMiddleware(["USER", "ADMIN"]), AuthController.getUsers);

module.exports = router;