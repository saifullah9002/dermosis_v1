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
    let date = new Date(appointment.appointmentDateTime);
    const call = await callService.createCall({ appointmentId: appointment._id });
    patientData = await userService.getUserById(appointment.patientId);
    doctorData = await userService.getUserById(appointment.doctorId);
    console.log("date new  "+date.toISOString());
    console.log("date");
    date = new Date(date.getFullYear, date.getMonth, date.getDay, date.getHours,date.getMinutes, 0);

    console.log("appointment:  "+ date);

    let c = scheduler.scheduleJob(date, ()=> {
        const doctorScoketId = socketController.connectedClients.get(String(appointment.doctorId));
        const patientScoketId = socketController.connectedClients.get(String(appointment.patientId));
        console.log("emitting signal to: "  + doctorScoketId + "   and   " + patientScoketId );
        console.log(Date.now);
        io.to(doctorScoketId).emit("appointment starting", [call._id,patientData.firstname + " " + patientData.lastname ]);
        io.to(patientScoketId).emit("appointment starting", [call._id,doctorData.firstname + " " + doctorData.lastname]);
    });

    console.log("eqgrb "+c);
};


/**
 * Schedule appointment notification
 */
const scheduleAppointmentNotifications = async (appointments) => {
    const io = socketController.getIO();

    appointments.forEach(async appointment => {
        const date = new Date(appointment.appointmentDateTime);
        const call = await callService.createCall({ appointmentId: appointment._id });
        patientData = await userService.getUserById(appointment.patientId);
        doctorData = await userService.getUserById(appointment.doctorId);
        console.log("running appointment service, current appointment id: " + appointment._id);
        scheduler.scheduleJob( date, () => {
            const doctorScoketId = socketController.connectedClients.get(String(appointment.doctorId));
            const patientScoketId = socketController.connectedClients.get(String(appointment.patientId));
            console.log("emitting signal to: "  + doctorScoketId + "   and   " + patientScoketId );
            io.to(doctorScoketId).emit("appointment starting", [call._id,patientData.firstname + " " + patientData.lastname ]);
            io.to(patientScoketId).emit("appointment starting", [call._id,doctorData.firstname + " " + doctorData.lastname]);
        });
    });
};

module.exports = {
    scheduleAppointmentNotification,
    scheduleAppointmentNotifications
};
