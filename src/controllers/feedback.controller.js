const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, appointmentService, feedbackService } = require('../services');
const ApiError = require('../utils/ApiError');

const createFeedback = catchAsync(async (req, res) => {
    const feedback = await feedbackService.createFeedback(req.body)
    res.status(httpStatus.OK).send(feedback);
});

const getFeedback = catchAsync(async (req, res) => {
    const feedbacks = await feedbackService.getAllDoctorsFeedbacks({appointmentId: req.body.appointmentId});
    console.log(feedbacks);
    if (feedbacks.length == 0) {
    const feedback = await feedbackService.createFeedback(req.body)
    res.status(httpStatus.OK).send(feedback);
    }
    else{
        res.status(httpStatus.BAD_REQUEST).send("feedback against appointment exists");
    }
});

const getDoctorFeedbacks = catchAsync(async (req, res) => {
    console.log(req.body.doctorId);
    const feedbacks = await feedbackService.getAllDoctorsFeedbacks({doctorId: req.body.doctorId});
    var totalRating = 0;
    for (var i in feedbacks)
    {
        totalRating= totalRating+feedbacks[i].rating;
    }
    totalRating = totalRating / feedbacks.length;
    res.status(httpStatus.OK).send({feedbacks, totalRating});
});

const getFeedbacks = catchAsync(async (req, res) => {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.status(httpStatus.OK).send(feedbacks);
});

const updateFeedback = catchAsync(async (req, res) => {
    const feedback = await feedbackService.updateFeedback(req.body, req.params.feedbackId);
    res.status(httpStatus.OK).send(feedback);
});

const deleteFeedback = catchAsync(async (req, res) => {
    await feedbackService.deleteFeedback(req.params.feedbackId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createFeedback,
    getFeedback,
    getFeedbacks,
    getDoctorFeedbacks,
    updateFeedback,
    deleteFeedback
};
