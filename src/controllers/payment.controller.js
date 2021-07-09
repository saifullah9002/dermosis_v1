/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { paymentService, appointmentService, userService } = require('../services');
const ApiError = require('../utils/ApiError');
const { x } = require('joi');

const getPaymentForAppointment = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentForAppointment(req.params.appointmentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  res.status(httpStatus.OK).send(payment);
});

const getPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  res.status(httpStatus.OK).send(payment);
});

const getPayments = catchAsync(async (req, res) => {
  const payment = await paymentService.getAllPayments();
  res.status(httpStatus.OK).send(payment);
});

const getMyPayments = catchAsync(async (req, res) => {
  const payment = await paymentService.getAllPaymentsforUser();
  const myPayments = [];

  for(let i=0; i< payment.length;i++){
    if(payment[i]["appointmentId"]["doctorId"]["_id"]==req.params.doctorId || payment[i]["appointmentId"]["patientId"]["_id"]==req.params.doctorId){
      myPayments.push(payment[i]);
  }
}

  /*for (x in payment){
    
    }
  }*/

  
  // {"appointmentId.doctorId._id" : req.params.doctorId}

 
  
  res.status(httpStatus.OK).send(myPayments);
});

const updatePayment = catchAsync(async (req, res) => {
  const payment = await paymentService.updatePayment(req.body, req.params.paymentId);
  res.status(httpStatus.OK).send(payment);
});

const deletePayment = catchAsync(async (req, res) => {
  await paymentService.deletePayment(req.params.paymentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const pay = catchAsync(async (req, res) => {
  const payment = await paymentService.pay(req.params.paymentId);
  res.status(httpStatus.OK).send(payment);
});


const withdraw = catchAsync(async (req, res) => {
  let user = await userService.getUserById(req.params.userId);
  let msg ={};
  if (user.earnings > 0){
    await  userService.updateUserById(req.params.userId, {earnings:0})
    msg = {msg: "Withdrawal Complete" , withdrawn: user.earnings };
  }
  else{
    msg = {msg: "Withdrawal Failed" , withdrawn: 0};
  }
  res.status(httpStatus.OK).send(msg);
});


module.exports = {
  getPaymentForAppointment,
  getPayment,
  withdraw,
  updatePayment,
  deletePayment,
  getPayments,
  pay,
  getMyPayments
};
