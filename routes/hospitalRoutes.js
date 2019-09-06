const express = require('express')
const hospitalController = require('../controllers/hospitalController')
const hrouter = express.Router()

hrouter.post('/signUp', hospitalController.hospitalSignUp)

hrouter.post('/role/:hospitalId',hospitalController.addRole)

hrouter.get('/hospitalProfile/:hospitalId',hospitalController.getHospitalProfile)

hrouter.put('/updateHospitalProfile/:hospitalId',hospitalController.updateHospitalProfile)

hrouter.get('/getRegisteredRefferal/:hospitalId/:start/:end',hospitalController.getRegisteredRefferal)

hrouter.get('/getRefferalCount/:hospitalId',hospitalController.getRefferalCount)

module.exports=hrouter