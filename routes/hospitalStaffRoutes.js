const express = require('express')
const hospitalStaffController = require('../controllers/hospitalStaffController')
const hsrouter = express.Router()

hsrouter.get('/roles/:hospitalId', hospitalStaffController.getHospitalStaffRoles)

hsrouter.get('/specialities/:hospitalId', hospitalStaffController.getHospitalStaffSpecialities)

hsrouter.get('/branches/:hospitalId', hospitalStaffController.getHospitalBranchesByHospitalId)

hsrouter.post('/addStaff/:hospitalId/:hospitalBranchId',hospitalStaffController.addStaff)

hsrouter.get('/getStaff/:hospitalId/:hospitalBranchId/:start/:end',hospitalStaffController.getStaffs)

hsrouter.get('/staffProfile/:staffId',hospitalStaffController.getStaffProfile)

hsrouter.put('/updateStaffProfile/:staffId',hospitalStaffController.updateStaffProfile)

hsrouter.get('/getStaffCount/:hospitalId/:hospitalBranchId',hospitalStaffController.getStaffCount)

hsrouter.put('/updateStaff/:hospitalId/:hospitalBranchId/:staffId',hospitalStaffController.updateStaff)

hsrouter.put('/update/staffPermission/:hospitalId/:hospitalBranchId',hospitalStaffController.updateStaffPermission)

hsrouter.post('/addReferralDoctor/:hospitalId/:hospitalBranchId',hospitalStaffController.sendMail)

hsrouter.post('/registerReferralDoctor',hospitalStaffController.registerReferralDoctor)

hsrouter.get('/ReferralDoctor/:hospitalId/:hospitalBranchId/:start/:end',hospitalStaffController.getReferralDoctor)

hsrouter.get('/ReferralDoctorCount/:hospitalId/:hospitalBranchId',hospitalStaffController.getReferralDoctorCount)

hsrouter.get('/getReferralProfile/:referralId',hospitalStaffController.getReferralProfile)

hsrouter.put('/updateReferralProfile/:referralId',hospitalStaffController.updateReferralProfile)

hsrouter.get('/getReferralHospital/:referralId/:start/:end',hospitalStaffController.getReferralHospital)

hsrouter.get('/getReferralHospitalCount',hospitalStaffController.getReferralHospitalCount)

hsrouter.put('/updateStatus/:hospitalId/:referralId',hospitalStaffController.updateRefferalInitiationStatus)

module.exports= hsrouter
