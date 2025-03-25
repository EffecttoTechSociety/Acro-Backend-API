const { Router } = require("express");
const { sendOtp, verifyOtp, resetEmailAndPassword } = require("../utils/otpService");
const { authenticateUser } = require("../middlewares/auth");

const authRouter = Router();

authRouter.post("/sendotp", authenticateUser,sendOtp);
authRouter.post("/verifyotp", authenticateUser,verifyOtp);
authRouter.patch("/updatecredentials",authenticateUser,resetEmailAndPassword)

module.exports = authRouter;
