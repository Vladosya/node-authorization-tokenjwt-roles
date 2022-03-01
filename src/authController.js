const User = require('./models/User.js');
const Role = require('./models/Role.js');
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const { secret } = require('./config.js');

const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles
	};

	return jwt.sign(payload, secret, { expiresIn: "24h" }); // 2 параметром секретный ключ; 3 парам. объект опций (expiresIn - время жизни токена)
}

class AuthController {
	async registration(req, res) {
		try {
			const errors = validationResult(req); // достали результат валидации
			if (!errors.isEmpty()) { // в случае ошибок покажем ...
				return res.status(400).json({
					status: 400,
					message: "Ошибка при регистрации",
					errors
				})
			}
			const { username, password } = req.body;
			const candidate = await User.findOne({ username });
			if (candidate) {
				return res.status(400).json({
					status: 400,
					message: "Пользователь с таким именем уже существует"
				})
			}
			const hashPassword = bcrypt.hashSync(password, 7); // хешируем пароль для безопасности
			const userRole = await Role.findOne({ value: "USER" }); // ЕСЛИ МЫ ХОТИМ СОЗДАТЬ ПОЛЬЗОВАТЕЛЯ С ПРАВАМИ АДМИНИСТРАТОРА, ТО ПОСТАВИТЬ: ADMIN
			const user = new User({ username, password: hashPassword, roles: [userRole.value] });
			await user.save();
			return res.status(200).json({
				status: 200,
				message: "Пользователь был успешно зарегистрирован"
			})
		} catch (error) {
			console.log("error: ---> ", error);
			res.status(400).json({
				status: 400,
				message: "Ошибка регистрации"
			})
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body;
			const user = await User.findOne({ username });
			if (!user) {
				return res.status(400).json({
					status: 400,
					message: `Пользователь ${username} не найден`
				})
			}
			const validPassword = bcrypt.compareSync(password, user.password); // для сравнения захешированного пароля с не захешированным
			if (!validPassword) {
				return res.status(400).json({
					status: 400,
					message: `Неправильный логин или пароль`
				})
			}
			const token = generateAccessToken(user._id, user.roles);
			return res.status(200).json({
				status: 200,
				message: `Авторизация прошла успешно`,
				token: token
			})
		} catch (error) {
			res.status(400).json({
				status: 400,
				message: "Ошибка логинизации"
			})
		}
	}
	async getUsers(req, res) {
		try {
			const users = await User.find();
			return res.status(200).json({
				status: 200,
				message: "Успешное получение пользователей",
				result: users
			})
		} catch (error) {
			res.status(400).json({
				status: 400,
				message: "Ошибка получения пользователей"
			})
		}
	}
}

module.exports = new AuthController();


/** В самом начале после создания схемы Role мы записываем в базу данных
 * и создаем там роли 
 * const userRole = new Role();
	const adminRole = new Role({ value: "ADMIN" });
	await userRole.save();
	await adminRole.save();
 */