const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getPayment = {
    params: Joi.object().keys({
        paymentId: Joi.string().custom(objectId),
    }),
};

const getDoctor = {
    params: Joi.object().keys({
        doctorId: Joi.string().custom(objectId),
    }),
};

const getPaymentForAppointment = {
    params: Joi.object().keys({
        appointmentId: Joi.string().custom(objectId),
    }),
};

const deletePayment = {
    params: Joi.object().keys({
        paymentId: Joi.string().custom(objectId),
    }),
};

const userId = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const updatePayment = {
    params: Joi.object().keys({
        paymentId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            appointmentId: Joi.string(),
            paymentMethod: Joi.string(),
            isPaid: Joi.boolean()
        })
        .min(1),
};

module.exports = {
    getPayment,
    getPaymentForAppointment,
    deletePayment,
    updatePayment,
    getDoctor,
    userId
};
