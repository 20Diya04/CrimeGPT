import express from "express";

import { registerUser, 
    sendOtpController, verifyOtpController, Login } from "../controller/UserController.js";

const UserRoute = express.Router();

UserRoute.post('/register', registerUser);
UserRoute.post('/send-otp', sendOtpController);
UserRoute.post('/verify-otp', verifyOtpController);
UserRoute.post('/login', Login);

export default UserRoute;