const NodeCache = require("node-cache");
const nodemailer = require("nodemailer");
const { User } = require("../models");
const bcrypt = require("bcrypt");

const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // OTP expires in 5 minutes

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables
    pass: process.env.EMAIL_PASS,
  },
});

// Generate and Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    otpCache.set(email, otp); // Store OTP in cache

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpCache.get(email);

  if (!storedOtp) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // Update is_verified and set verified_at timestamp
  await User.update(
    { is_verified: true, verified_at: new Date() },
    { where: { email } }
  );
  otpCache.del(email); // Remove OTP after successful verification
  res.status(200).json({ message: "OTP verified successfully" });
};

exports.resetEmailAndPassword = async (req, res) => {
  const { email, newEmail, newPassword, otp } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const storedOtp = otpCache.get(email);

    if (!storedOtp) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.email = newEmail;
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Credentials updated successfully" });
  } catch (error) {
    console.error("Error resetting email and password:", error);
    res.status(500).json({ error: "Error resetting email and password" });
  }
};
