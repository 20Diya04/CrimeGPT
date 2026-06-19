import express from "express";

import { registerUser, 
    sendOtpController, 
    verifyOtpController, 
    Login,
    getUserDataById 
} from "../controller/UserController.js";

const UserRoute = express.Router();

UserRoute.post('/register', registerUser);
UserRoute.post('/send-otp', sendOtpController);
UserRoute.post('/verify-otp', verifyOtpController);
UserRoute.post('/login', Login);
UserRoute.get('/getUserDataById/:id', getUserDataById);

export default UserRoute;