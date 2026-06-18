import express from "express";

import { registerUser, sendOtpController, verifyOtpController } from "../controller/UserController.js";

const UserRoute = express.Router();

UserRoute.post('/register', registerUser);
UserRoute.post('/send-otp', sendOtpController);
UserRoute.post('/verify-otp', verifyOtpController);

export default UserRoute;