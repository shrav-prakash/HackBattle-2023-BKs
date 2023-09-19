import Patient from './models/patient';

export const getPatients = catchAsync(async (req, res) => {
    const patients = await Patient.findMany({
        consultation: { doctor: req.doctor._id }
    })
    return res.status(200).json({
        msg: "Patients Retrieved",
        patients: patients
    })
})

export const getDetails = catchAsync(async (req, res) => {
    return res.status(200).json({
        msg: "Doctor Details",
        details: req.doctor.toJSON()
    })
})