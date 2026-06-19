import User from "../models/User.js";
import bcrypt from "bcrypt";
import { otpStore } from "../utils/otpStore.js";
import { sendOTP } from "../utils/smsService.js";
import { generateToken } from "../utils/jwtUtils.js";

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



export const getUserDataById = async (req, res) => {
  try {
    const user = await User
      .findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid user ID",
      });
    }

    console.error(error);
    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};



export const Login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email })

    if (!email) {
      return res.status(400).json({
        status: 0,
        message: "Email is required",
        error: "Email is required"
      })
    }

    if (!password) {
      return res.status(200).json({
        status: 0,
        message: "Password is required",
        error: "Password is required"
      })
    }

    if (!userData) {
      return res.status(400).json({
        status: 0,
        message: "User not found",
        error: "User not found"
      })
    }

    const Match = await bcrypt.compare(password, userData.password)

    if (!Match) {
      return res.status(401).json({
        status: 0,
        message: "Invalid password",
        error: "Invalid password"
      })
    }


    const token = generateToken(userData);
    return res.status(200).json({
      status: 1,
      message: "Login Done ",
      data: {
        _id: userData._id,
        email: userData.email,
        role: userData.role,
        token: token
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 0,
      message: "Internal Server Error", 
      error: error.message
    })
  }

}