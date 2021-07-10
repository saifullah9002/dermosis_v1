const scheduler = require('node-schedule');
const { userService } = require('.');
const app = require('../app');
const socketController = require('./../controllers/socket.controller');
const callService = require('./call.service');

/**
 * Schedule appointment notification
 * @param {Appointment} appointment
 */
const scheduleAppointmentNotification = async (appointment) => {
    const io = socketController.getIO();
    const date = new Date(appointment.appointmentDateTime);
    const call = await callService.createCall({ appointmentId: appointment._id });
    scheduler.scheduleJob(date, function () {
        const doctorScoketId = socketController.connectedClients.get(String(appointment.doctorId));
        const patientScoketId = socketController.connectedClients.get(String(appointment.patientId));
        io.to(doctorScoketId).emit("appointment starting", call._id);
        io.to(patientScoketId).emit("appointment starting", call._id);
    });
};

/**
 * Schedule appointment notification
 */
const scheduleAppointmentNotifications = async (appointments) => {
    const io = socketController.getIO();

    appointments.forEach(async appointment => {
        const date = new Date(appointment.appointmentDateTime);
        const call = await callService.createCall({ appointmentId: appointment._id });
        scheduler.scheduleJob(date, function () {
            const doctorScoketId = socketController.connectedClients.get(String(appointment.doctorId));
            const patientScoketId = socketController.connectedClients.get(String(appointment.patientId));
            patientData = await userService.getUserById(appointment.patientId);
            doctorData = await userService.getUserById(appointment.doctorId);
            io.to(doctorScoketId).emit("appointment starting", [call._id,patientData.firstname + " " + patientData.lastname ]);
            io.to(patientScoketId).emit("appointment starting", [call._id,doctorData.firstname + " " + doctorData.lastname]);
        });
    });
};

module.exports = {
    scheduleAppointmentNotification,
    scheduleAppointmentNotifications
};
