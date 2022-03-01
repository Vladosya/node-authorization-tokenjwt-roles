const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter.js");

require("dotenv/config");

const app = express();

app.use(express.json());
app.use("/api-v1", authRouter);

const startApp = async () => {
	try {
		await mongoose.connect(process.env.DB_URL);
		app.listen(process.env.PORT, () => {
			console.log("starting server on PORT", process.env.PORT);
		})
	} catch (error) {
		console.log("Error in startApp func -----> ", e);
	}
}

startApp();