const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { paymentService, appointmentService, userService } = require('../services');
const ApiError = require('../utils/ApiError');
const scheduler = require('./../services/scheduler.service');


const createAppointmnet = catchAsync(async (req, res) => {
    const appointment = await appointmentService.createAppointment(req.body);
    const payment = await paymentService.createPayment({ appointmentId: appointment._id });
    scheduler.scheduleAppointmentNotification(appointment);
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
    const userAppointments=[]
    for (const i in appointments)
    {
        let user = await userService.getUserById(appointments[i].doctorId);
        console.log(appointments[i].doctorId);
        console.log(appointments[i]);
        let appointment = appointments[i];
        userAppointments.push({appointment,  user});
    }

    // const appointments = await appointmentService.getAllAppointments();
    res.status(httpStatus.OK).send(userAppointments);
});


const getDocAppointmnets = catchAsync(async (req, res) => {
    const appointments = await appointmentService.findAppointments({doctorId: req.params.doctorId});
    const docAppointments=[]
    for (const i in appointments)
    {
        let user = await userService.getUserById(appointments[i].patientId);
        let appointment = appointments[i];
        docAppointments.push({appointment,  user});
    }
    // const appointments = await appointmentService.getAllAppointments();
    res.status(httpStatus.OK).send(docAppointments);
});



const getDocPatients = catchAsync(async (req, res) => {
    const appointments = await appointmentService.findAppointments({doctorId: req.params.doctorId});
    let docPatients=[]
    for (const i in appointments)
    {
        let user = await userService.getUserById(appointments[i].patientId);
        docPatients.push(user);
    }
    jsonObject = docPatients.map(JSON.stringify);
    uniqueSet = new Set(jsonObject);
    docPatients = Array.from(uniqueSet).map(JSON.parse);
    res.status(httpStatus.OK).send(docPatients);
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
    getDocAppointmnets,
    updateAppointment,
    deleteAppointment,
    getDocPatients
};
