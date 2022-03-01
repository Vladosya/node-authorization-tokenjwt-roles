const jwt = require('jsonwebtoken');
const { secret } = require('../config.js');

module.exports = (req, res, next) => { // middlewware для проверки токена авторизации
	if (req.method === "OPTIONS") {
		next();
	}

	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(403).json({
				status: 403,
				message: "Пользователь не авторизован"
			})
		}
		const decodedData = jwt.verify(token, secret);
		req.user = decodedData;
		next();
	} catch (error) {
		return res.status(403).json({
			status: 403,
			message: "Пользователь не авторизован"
		})
	}
};