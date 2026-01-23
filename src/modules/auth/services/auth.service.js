const ApiError = require("../../../utils/apiErrors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Developer = require("../schemas/developer.schema");

const {
  isExists,
  createDev,
  findUserByEmail,
} = require("../repositories/auth.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../../../utils/sendmailer");
const { hashOtp, generateOTP, compareOtp } = require("../../../utils/otp");
const tempUsers = [];

const registerdev = async (name, email, password) => {
  if(!email || !name || !password) throw new ApiError(400, "all fields are requierd");
  const exists = await isExists(email);
  if (exists) throw new ApiError(400, "Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = generateOTP();
  const resetOTP = await hashOtp(otp);
  const expiresInMin = Number(process.env.OTP_EXPIRES_MIN || 15);
  const resetOTPExpires = new Date(Date.now() + expiresInMin * 60 * 1000);
  const token = jwt.sign(
    { name, email, hashedPassword, resetOTP},
    process.env.JWT_SECRET,
    { expiresIn: "10m" },
  );

  tempUsers.push({
    name,
    email,
    password: hashedPassword,
    otp,
    createdAt: Date.now(),
    resetOTP,
    resetOTPExpires,
  });
  const html = `
      <p>Hi ${name},</p>
      <p>Your verifcation code is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in ${expiresInMin} minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;

  await sendMail(email, "verify Email Code", html);
  console.log(hashOtp);
  console.log(expiresInMin);

  return token;
};

const otpToCreatAcc = async (otp, token) => {
  if (!otp) throw new ApiError(400, "OTP is required");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.email) throw new ApiError(400, "Email is required");
  const isMatchedOtp = await compareOtp(otp, decoded.resetOTP);
  if (!isMatchedOtp) throw new ApiError(401, "Invalid OTP");

  if (decoded.resetOTPExpires < new Date()) throw new ApiError(400, "OTP expired");

  const developer = await Developer.create({
    name: decoded.name,
    email: decoded.email,
    password: decoded.hashedPassword,
  });

  return developer;
};

const logindev = async (email, password) => {
  const developer = await findUserByEmail(email);
  if (!developer) throw new ApiError(401, "Invalid email or password");
  const isMatch = await bcrypt.compare(password, developer.password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");
  const token = jwt.sign(
    { id: developer._id, email: developer.email, role: developer.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  return { developer, token };
};

module.exports = { registerdev, logindev, otpToCreatAcc };
