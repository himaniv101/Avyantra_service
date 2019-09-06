const express = require('express')
const patientValidation = require('../validation/patientValidation')
const patientController = require('../controllers/patientController')

const prouter = express.Router()

prouter.put('/update/babyProfile/:studyId',patientController.updateBabyProfileByStudyId)

prouter.put('/update/motherProfile/:studyId',patientController.updateMotherProfileByStudyId)

prouter.post('/models/save',patientValidation.validate('savePatientModels'),patientController.savePatientModels)

prouter.get('/readingId/:study_id',patientController.getReadingIdByStudyId)

prouter.get('/search/:id/:hospitalId' , patientController.searchReadingIdByStudyIdAndMrn)

prouter.get('/models/:studyId',patientController.getPatientModels)

prouter.get('/baby_appears/:studyId/:hospitalId/:pageNo/:readingId', patientController.getBabyAppearsModel)

prouter.get('/baby_resp/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyRespModel)

prouter.get('/baby_cv/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyCVModel)

prouter.get('/baby_cns/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyCNSModel)

prouter.get('/baby_git/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyGITModel)

prouter.get('/baby_investigation/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyInvestigationModel)

prouter.get('/baby_antibiotic/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyAntibioticModel)

prouter.get('/baby_final/:studyId/:hospitalId/:pageNo/:readingId',patientController.getBabyFinalModel)

prouter.put('/update/baby_appears/:study_id/:reading',patientValidation.validate('updateBabyAppearsModel') ,patientController.updateBabyAppearsModel)

prouter.put('/update/baby_resp/:study_id/:reading', patientValidation.validate('updateBabyRespModel'),patientController.updateBabyRespModel)

prouter.put('/update/baby_cv/:study_id/:reading',patientValidation.validate('updateBabyCVModel'), patientController.updateBabyCVModel)

prouter.put('/update/baby_cns/:study_id/:reading',patientValidation.validate('updateBabyCNSModel'),patientController.updateBabyCNSModel)

prouter.put('/update/baby_git/:study_id/:reading',patientValidation.validate('updateBabyGITModel'),patientController.updateBabyGITModel)

prouter.put('/update/baby_investigation/:study_id/:reading',patientValidation.validate('updateBabyInvestigationModel') ,patientController.updateBabyInvestigationModel)

prouter.put('/update/baby_antibiotic/:study_id/:reading',patientValidation.validate('updateBabyAntibioticModel'), patientController.updateBabyAntibioticModel)

prouter.put('/update/baby_final/:study_id/:reading',patientValidation.validate('updateBabyFinalModel'),patientController.updateBabyFinalModel)

prouter.get('/generateReport',patientController.generateReport)

prouter.post('/medicalRecord/:hospitalId/:hospitalBranchId',patientController.saveBabyMedicalRecord)

prouter.get('/medicalRecord/:hospitalId/:hospitalBranchId/:start/:end',patientController.getBabyMedicalRecord)

prouter.put('/medicalRecord/:studyId/:patientId/:hospitalId/:hospitalBranchId',patientController.updateBabyMedicalRecord)

prouter.get('/medicalRecordCount/:hospitalId/:hospitalBranchId',patientController.babyMedicalRecordCount)

module.exports= prouter