const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { paymentService, appointmentService, userService } = require('../services');
const ApiError = require('../utils/ApiError');

const createAppointmnet = catchAsync(async (req, res) => {
    const appointment = await appointmentService.createAppointment(req.body);
    const payment = await paymentService.createPayment({ appointmentId: appointment._id });
    res.status(httpStatus.OK).send({ appointment, payment });
});

const getAppointmnet = catchAsync(async (req, res) => {
    const appointment = await appointmentService.getAppointmentById(req.params.appointmentId);
    if (!appointment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Appointment not found');
    }
    res.status(httpStatus.OK).send(appointment);
});

const getAppointmnets = catchAsync(async (req, res) => {
    console.log(req.user._id);
    const appointments = await appointmentService.findAppointments({patientId: req.user._id});
    var userAppointments=[]
    for (var i in appointments)
    {
        var user = await userService.getUserById(appointments[i].doctorId);
        console.log(appointments[i].doctorId);
        console.log(appointments[i])
        appointment = appointments[i];
        userAppointments.push({appointment,  user});
    }

    // const appointments = await appointmentService.getAllAppointments();
    res.status(httpStatus.OK).send(userAppointments);
});

const updateAppointment = catchAsync(async (req, res) => {
    const appointment = await appointmentService.updateAppointment(req.body, req.params.appointmentId);
    res.status(httpStatus.OK).send(appointment);
});

const deleteAppointment = catchAsync(async (req, res) => {
    await appointmentService.deleteAppointment(req.params.appointmentId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createAppointmnet,
    getAppointmnet,
    getAppointmnets,
    updateAppointment,
    deleteAppointment
};
