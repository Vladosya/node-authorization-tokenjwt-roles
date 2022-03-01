const jwt = require('jsonwebtoken');
const { secret } = require('../config.js');

module.exports = (roles) => { // middleware для проверки токена авторизации и роли, которые доступны
	return (req, res, next) => {
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
			const { roles: userRoles } = jwt.verify(token, secret);
			let hasRole = false;
			userRoles.forEach((role) => {
				if (roles.includes(role)) {
					hasRole = true;
				}
			})
			if (!hasRole) {
				return res.status(403).json({
					status: 403,
					message: "У вас нет доступа"
				})
			}
			next();
		} catch (error) {
			return res.status(403).json({
				status: 403,
				message: "Пользователь не авторизован"
			})
		}
	}
}