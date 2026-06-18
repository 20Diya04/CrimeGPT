import User from "../models/User.js";
import bcrypt from "bcrypt";
import { otpStore } from "../utils/otpStore.js";
import { sendOTP } from "../utils/smsService.js";

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password
    } = req.body;

    const otpData = otpStore[phone];

    if (!otpData || !otpData.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your phone number first",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    delete otpStore[phone];

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = otpStore[phone];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[phone];

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    otpStore[phone].verified = true;

    return res.json({
      success: true,
      message: "Phone verified",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const sendOtpController = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    otpStore[phone] = {
      otp,
      verified: false,
      expiresAt: Date.now() + 2 * 60 * 1000,
    };

    console.log("Generated OTP:", otp);

    const sms = await sendOTP(
      `+91${phone}`,
      "otp",
      otp
    );

    if (!sms.status) {
      return res.status(500).json({
        success: false,
        message: sms.message,
        error: sms.error,
      });
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};