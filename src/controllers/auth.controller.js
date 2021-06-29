/* eslint-disable */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { use } = require('../routes/v1');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user.user);
  res.status(httpStatus.CREATED).send({ user: user.user, tokens });
  emailService.sendEmail(req.body.email, 'Confirmation code', `Your confirmation code is ${user.otp}`);
});

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const user = await authService.verifyOTP(email, otp);
  res.status(httpStatus.OK).send(user);
});

const resendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  const newOTP = Math.floor(Math.random() * (999999 - 100000) + 100000);
  const updatedUser = await userService.updateUserById(user._id, { otp: newOTP });
  emailService.sendEmail(req.body.email, 'Confirmation code - Dermosis', `Your new confirmation code is ${newOTP}`);
  res.status(httpStatus.OK).send('OTP Sent! check email.');
});

const continueRegistration = catchAsync(async (req, res) => {
  const updateBody = req.body;
  updateBody.role = updateBody.type;
  if (updateBody.role === 'patient') {
    updateBody.isRegistrationComplete = true;
  }
  delete updateBody.type;
  const updatedUser = await userService.updateUserById(req.user._id, updateBody);
  res.status(httpStatus.OK).send(updatedUser);
});

const continueRegistrationDoctor = catchAsync(async (req, res) => {
  const updateBody = req.body;
  updateBody.isRegistrationComplete = false;
  const updatedUser = await userService.updateUserById(req.user._id, updateBody);
  res.status(httpStatus.OK).send(updatedUser);
});

const login = catchAsync(async (req, res) => {
  const { phone, password } = req.body;
  const user = await authService.loginUserWithPhoneAndPassword(phone, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const changePassword = catchAsync(async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  await authService.changePassword(oldPassword, newPassword, req.user._id);
  res.status(httpStatus.OK).send();
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  const newOTP = Math.floor(Math.random() * (999999 - 100000) + 100000);
  const updatedUser = await userService.updateUserById(user._id, { otp: newOTP });
  console.log(newOTP);
  emailService.sendEmail(req.body.email, 'Forgot Password!- Dermosis', `Your new confirmation code for resetting password is ${newOTP}`);
  res.status(httpStatus.OK).send('OTP Sent! check email.');
});


const setForgottenPassword = catchAsync(async(req, res) => {
  const { password, otp, email }= req.body;
  const user = await userService.getUserByEmail(email);
  console.log(user.otp);
  if (!user || user.otp !== otp)
  {
    res.status(httpStatus.OK).send("incorrect otp");
  }
  else
  {
    const updatedUser = await userService.updateUserById(user._id, { password: password });
    res.status(httpStatus.OK).send(updatedUser);
  }
  
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  continueRegistration,
  continueRegistrationDoctor,
  login,
  logout,
  refreshTokens,
  changePassword,
  forgotPassword,
  setForgottenPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
