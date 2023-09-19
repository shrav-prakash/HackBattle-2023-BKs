import Patient from '../models/patient';

export const postDetails = catchAsync(async (req, res) => {
    req.patient.height = req.body.height ? req.body.height : req.patient.height;
    req.patient.weight = req.body.weight ? req.body.weight : req.patient.weight;
    req.patient.medicalHistory = req.body.medicalHistory ? req.body.medicalHistory : req.patient.medicalHistory;

    await req.patient.save();
    return res.status(200).json({
        msg: "Updation Successful"
    })
})

export const addConsultation = catchAsync(async (req, res) => {
    req.patient.consultation = [...req.patient.consultation, req.body.consultation]
    await req.patient.save();
    return res.status(200).json({
        msg: "Added Consultation"
    });
})

export const getDetails = catchAsync(async (req, res) => {
    return res.status(200).json({
        details: req.patient.toJSON()
    })
})