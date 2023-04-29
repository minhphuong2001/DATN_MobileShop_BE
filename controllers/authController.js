require("dotenv").config();
const User = require("../models/User");
const asyncHandle = require("../middlewares/asyncHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const GenerateRefreshToken = require("../helpers/GenerateRefreshToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../helpers/sendMail");
const redisClient = require("../config/redis");
const saltRounds = 10;

module.exports = {
  // @route [POST] /api/auth/register
  // @desc User register
  // @access Public
  register: asyncHandle(async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if (!(email && password && confirmPassword)) {
      return next(new ErrorResponse(400, "Thiếu thông tin"));
    }

    if (password !== confirmPassword) {
      return next(new ErrorResponse(400, "Mật khẩu không hợp lệ"));
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return next(new ErrorResponse(400, "Email đã tồn tại"));
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    const refreshToken = GenerateRefreshToken(newUser._id);

    res.json({
      success: true,
      message: "Account successfully created",
      accessToken,
      refreshToken,
    });
  }),

  // @route [POST] /api/auth/login
  // @desc User login
  // @access Public
  login: asyncHandle(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse(400, "Thiếu email hoặc mật khẩu"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse(400, "Email hoặc mật khẩu không đúng"));
    }

    if (user.deleted == 1) {
      return next(new ErrorResponse(400, "Account has been deleted"));
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return next(new ErrorResponse(400, "Email hoặc mật khẩu không đúng"));
    }

    // Everything is good
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    const refreshToken = GenerateRefreshToken(user._id);

    res.json({
      success: true,
      message: "Logged in successfully",
      data: user,
      accessToken,
      refreshToken,
    });
  }),

  // @route [GET] /api/auth
  // @desc Confirm token
  // @access Public
  confirm: asyncHandle(async (req, res, next) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return next(new ErrorResponse(404, "Người dùng không tồn tại"));
    }

    res.json({ success: true, user });
  }),

  // @route [PUT] /api/auth
  // @desc Update user information
  // @access Private
  updateInfor: asyncHandle(async (req, res, next) => {
    const user = await User.findById(req.userId).select("-password");

    // Check for existing user
    if (!user) {
      return next(new ErrorResponse(404, "Người dùng không tồn tại"));
    }

    const {
      email = user.email,
      fullname = user.fullname,
      phone = user.phone,
      address = user.address,
      // money = 0,
    } = req.body;

    // Check for existing email
    if (email !== user.email) {
      const userWithEmail = await User.findOne({ email });

      if (userWithEmail)
        return next(new ErrorResponse(400, "Email đã tồn tại"));
    }

    // Everything is good

    user.fullname = fullname;
    user.phone = phone;
    user.email = email;
    user.address = address;
    // user.accountBalance = user.accountBalance + +money;
    await user.save();

    res.json({ success: true, user });
  }),

  // @route [PUT] api/auth/password
  // @desc Change password
  // @access Private
  changePassword: asyncHandle(async (req, res, next) => {
    const { password, newPassword, confirmPassword } = req.body;

    // Simple validation
    if (!(password && newPassword && confirmPassword)) {
      return next(new ErrorResponse(400, "Thiếu thông tin"));
    }

    // Check the difference between old password and new password
    if (password === newPassword) {
      return next(
        new ErrorResponse(400, "Mật khẩu mới không được trùng với mật khẩu cũ")
      );
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
      return next(new ErrorResponse(400, "Mật khẩu không đúng"));
    }

    const user = await User.findById(req.userId);

    // Check for existing user
    if (!user) {
      return next(new ErrorResponse(404, "Người dùng không tồn tại"));
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return next(new ErrorResponse(400, "Mật khẩu không đúng"));
    }

    // Everything is good
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Thay đổi mật khẩu thành công" });
  }),

  // @route [POST] /api/auth/token
  // @desc Refresh access token
  // @access private
  getAccessToken: asyncHandle(async (req, res, next) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    // Check for existing user
    if (!user) {
      return next(new ErrorResponse(404, "Người dùng không tồn tại"));
    }

    // Everything is good
    const accessToken = jwt.sign(
      { userId, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    const refreshToken = GenerateRefreshToken(userId);

    res.json({
      success: true,
      message: "Refesh access token",
      accessToken,
      refreshToken,
    });
  }),

  // @route [GET] /api/auth/logout
  // @desc Log out account
  // @access private
  logout: asyncHandle(async (req, res, next) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId }).select("-password");

    // Check for existing user
    if (!user) {
      return next(new ErrorResponse(404, "User does not exist"));
    }

    await redisClient.del(userId.toString());

    res.json({ success: true, message: "Logout successfully" });
  }),

  // @route [POST] /api/auth/forget-password
  // @desc Send password reset link to user's email
  // @access public
  forgetPassword: asyncHandle(async (req, res, next) => {
    const { email } = req.body;

    // Check empty email
    if (!email) {
      return next(new ErrorResponse(400, "Email trống"));
    }

    const user = await User.findOne({ email });

    // Check for existing user
    if (!user) {
      return next(new ErrorResponse(404, "Người dùng không tồn tại"));
    }

    // Everything is good
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: process.env.RESET_TOKEN_EXPIRE }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-mat-khau/${resetToken}`;

    const message = `
      Bạn nhận được e-mail này vì bạn đã yêu cầu đặt lại mật khẩu cho tài khoản người dùng của bạn tại Mimin Shop.
      Vui lòng click vào đây: ${resetUrl} để cập nhật lại mật khẩu.
      Link tồn tại trong 20 phút.
        `;

    try {
      await sendMail({
        email: email,
        subject: "Quên mật khẩu?",
        message,
      });

      return res.json({
        success: true,
        message: "Đã gửi email.",
      });
    } catch (err) {
      console.log(`Lỗi gửi mail: ${err.message}`);

      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(200).json({
      success: true,
      resetUrl,
    });
  }),

  // @route [PUT] /api/auth/reset-password/:resetToken
  // @desc Reset password with email
  // @access public
  resetPassword: asyncHandle(async (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;

    // Simple validate
    if (!(newPassword && confirmPassword)) {
      return next(new ErrorResponse(400, "Mật khẩu không đúng"));
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
      return next(new ErrorResponse(400, "Mật khẩu không đúng"));
    }

    const user = await User.findOne({ _id: req.userId });

    // Check for existing user
    if (!user) {
      return next(new ErrorResponse(404, "Người dùng không tồn tại"));
    }

    // Everything is good
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  }),
};
