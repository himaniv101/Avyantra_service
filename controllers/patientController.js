const pReadingModels = require('../sequelize')
const {validationResult} = require('express-validator/check')
const responseHelper = require('../helper/res')
const constant = require('../helper/constant')
const {sequelize} = require('../sequelize')
const queries = require('../helper/queries')
const mapper = require('../mapper/mapper')
const excel = require('exceljs');
const enumConst = require('../helper/enum')

exports.updateBabyProfileByStudyId =(req,res,next)=>{

pReadingModels.general_model.findAll({
  where:{
    study_id:req.params.studyId
  }
})
.then(result=>{
  if(result.length==0){
    res.json( responseHelper.notFound(constant.no_record_found))
  }
result = mapper.babyGeneralProfileMapper(result[0],req)
return result.save()
})
.then(result=>{
  res.json( responseHelper.success(constant.data_updated_successfully,result))
}) 
.catch(err => {
res.json(responseHelper.serveError(constant.error_msg,err))
})
}

exports.updateMotherProfileByStudyId =(req,res,next)=>{
  pReadingModels.maternal_model.findAll({
    where:{
      study_id:req.params.studyId
    }
  })
  .then(result=>{
    if(result.length==0){
      res.json( responseHelper.notFound(constant.no_record_found))
    }
  result = mapper.babyMaternalProfileMapper(result[0],req)
  return result.save()
  })
  .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,result))
  }) 
  .catch(err => {
  res.json(responseHelper.serveError(constant.error_msg,err))
  })
}

exports.savePatientModels = (req,res,next)=>{

  const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    pReadingModels.maternal_model.findAll({

      where:{
        study_id:req.body.baby_appears.study_id
      }

    }).then(result=>{
      if(result.length == 0){
        res.json( responseHelper.notFound(constant.no_maternal_record_found,result))
      }
    }).catch(err=>{
      res.json(responseHelper.serveError(constant.error_msg,err))

    })

var baby_respiratory_support = JSON.parse(req.body.baby_resp.baby_respiratory_support); 

req.body.baby_resp.baby_respiratory_support=baby_respiratory_support

pReadingModels.baby_appear_model.create(req.body.baby_appears).then().catch(err => {
  console.log("error:",err)
 })

pReadingModels.baby_resp_model.create(req.body.baby_resp).then().catch(err => {
  console.log("error:",err)
 })

pReadingModels.baby_cv_model.create(req.body.baby_cv).then().catch(err => {
  console.log("error:",err)
 })

pReadingModels.baby_cns_model.create(req.body.baby_cns).then().catch(err => {
  console.log("error:",err)
 })

pReadingModels.baby_git_model.create(req.body.baby_git).then().catch(err => {
  console.log("error:",err)
 })

pReadingModels.baby_final_model.create(req.body.baby_final).then().catch(err => {
  console.log("error:",err)
 })

pReadingModels.baby_antibiotic_model.create(req.body.baby_antibiotic).then().catch(err => {
  console.log("error:",err)
 })

pReadingModels.baby_investigation_model.create(req.body.baby_investigation).then(result => {
    res.json( responseHelper.success(constant.data_created_successfully,req.body))})
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getBabyAppearsModel =(req,res,next) =>{

  var study_id=req.params.studyId
  var hospital_id=req.params.hospitalId
  var reading=req.params.readingId

  sequelize.query('SELECT  DISTINCT * FROM patient_baby_appears_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  { replacements: { 
    study_id:study_id,
    hospital_id:hospital_id,
    reading:reading
  }, type: sequelize.QueryTypes.SELECT }
  ).then(result => {
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getBabyRespModel =(req,res,next)=>{
  var study_id=req.params.studyId
  var hospital_id=req.params.hospitalId
  var reading=req.params.readingId

  sequelize.query('SELECT  DISTINCT * FROM patient_baby_resp_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  { replacements: { 
    study_id:study_id,
    hospital_id:hospital_id,
    reading:reading
  }, type: sequelize.QueryTypes.SELECT }
  ).then(result => {
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getBabyCVModel =(req,res,next)=>{
  var study_id=req.params.studyId
  var hospital_id=req.params.hospitalId
  var reading=req.params.readingId

  sequelize.query('SELECT  DISTINCT * FROM patient_baby_cv_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  { replacements: { 
    study_id:study_id,
    hospital_id:hospital_id,
    reading:reading
  }, type: sequelize.QueryTypes.SELECT }
  ).then(result => {
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getBabyCNSModel=(req,res,next)=>{
  var study_id=req.params.studyId
  var hospital_id=req.params.hospitalId
  var reading=req.params.readingId

  sequelize.query('SELECT  DISTINCT * FROM patient_baby_cns_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  { replacements: { 
    study_id:study_id,
    hospital_id:hospital_id,
    reading:reading
  }, type: sequelize.QueryTypes.SELECT }
  ).then(result => {
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getBabyGITModel=(req,res,next)=>{
  var study_id=req.params.studyId
  var hospital_id=req.params.hospitalId
  var reading=req.params.readingId

  sequelize.query('SELECT  DISTINCT * FROM patient_baby_git_infos pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  { replacements: { 
    study_id:study_id,
    hospital_id:hospital_id,
    reading:reading
  }, type: sequelize.QueryTypes.SELECT }
  ).then(result => {
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getBabyInvestigationModel =(req,res,next)=>{
  var study_id=req.params.studyId
  var hospital_id=req.params.hospitalId
  var reading=req.params.readingId

  sequelize.query('SELECT  DISTINCT * FROM patient_baby_investigations pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  { replacements: { 
    study_id:study_id,
    hospital_id:hospital_id,
    reading:reading
  }, type: sequelize.QueryTypes.SELECT }
  ).then(result => {
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getBabyAntibioticModel =(req,res,next)=>{
  var study_id=req.params.studyId
  var hospital_id=req.params.hospitalId
  var reading=req.params.readingId

  sequelize.query('SELECT  DISTINCT * FROM patient_baby_antibiotics pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  { replacements: { 
    study_id:study_id,
    hospital_id:hospital_id,
    reading:reading
  }, type: sequelize.QueryTypes.SELECT }
  ).then(result => {
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getBabyFinalModel=(req,res,next)=>{
  var study_id=req.params.studyId
  var hospital_id=req.params.hospitalId
  var reading=req.params.readingId

  sequelize.query('SELECT  DISTINCT * FROM patient_baby_finals pbai  JOIN patient_basic_infos pbi ON  pbai.study_id = pbi.id WHERE study_id =:study_id AND hospital_id=:hospital_id AND reading = :reading LIMIT 1',
  { replacements: { 
    study_id:study_id,
    hospital_id:hospital_id,
    reading:reading
  }, type: sequelize.QueryTypes.SELECT }
  ).then(result => {
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.getReadingIdByStudyId = (req ,res , next)=>{

  pReadingModels.baby_appear_model.findAll(
    { 
    where :{study_id:req.params.study_id},
    order:[
      ['createdAt', 'DESC']
     ],
     limit: 1
    }
    )
  .then(result =>{
    console.log('result :' ,result.length)
     if(result.length == 0){
      res.json(responseHelper.success(constant.data_created_successfully,
        {
            study_id:req.params.study_id,
            reading_id:'R1'
        }))
      }else{
        var reading = result[0].reading
        var readingChar=reading.substring(0,1)
        var readingNo=reading.substring(1);
        ++readingNo
        reading = readingChar.concat(readingNo);
        res.json(responseHelper.success(constant.data_created_successfully,
          {
              study_id:req.params.study_id,
              reading_id:reading
          }))
     }
   }).catch(err => {
    res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.searchReadingIdByStudyIdAndMrn = (req,res,next)=>{
  var id = req.params.id
  var hospitalId =req.params.hospitalId
  var array =[]
  pReadingModels.basic_model.findAll({
  where:{
    baby_medical_record_number:id,
    hospital_id:hospitalId
    }
  }).then(result => {
  
  if(result.length==0){
    res.json( responseHelper.notFound(constant.no_record_found))
  }
    var basicResult ={
      study_id:result[0].id,
      baby_medical_record_number:result[0].baby_medical_record_number,
      reading:null
    }
    array[0]=basicResult
    var studyId = result[0].id
    pReadingModels.baby_appear_model.findAll({
      where:{
        study_id:studyId
      }
    })
    .then(result => {
     if(result.length == 0 ){
      res.json( responseHelper.success(constant.success,array))
     }else{
      sequelize.query('SELECT DISTINCT pbai.study_id,pbi.baby_medical_record_number,pbai.reading FROM patient_baby_appears_infos AS pbai,patient_basic_infos AS pbi WHERE pbai.study_id= pbi.id AND pbi.baby_medical_record_number= :baby_medical_record_number AND pbi.hospital_id =:hospital_id',
      { replacements: { baby_medical_record_number: id , hospital_id :hospitalId }, type: sequelize.QueryTypes.SELECT }
      )
      .then(result => {
        res.json( responseHelper.success(constant.success,result))
      })
     }
    })
   })
   .catch(err => {
    res.json({
        error_message:err
    })
  })
  }
  
exports.getPatientModels =(req,res,next)=>{
    var models ={
      baby_appears :{},
      baby_resp:{},
      baby_cv:{},
      baby_cns:{},
      baby_git:{},
      baby_investigation:{},
      baby_antibiotic:{},
      baby_final:{}
    }

  pReadingModels.baby_appear_model.findAll(
    { 
    where :
    {
      study_id:req.params.studyId,
    },
    order:[
      ['createdAt', 'DESC']
     ],
     limit: 1
    }).then(result => {

      if(result.length == 0){
        
        res.json( responseHelper.notFound(constant.no_record_found))

      }

      models.baby_appears=result[0]
    }).catch(err => {
         console.log("error :" ,err)
    })

    pReadingModels.baby_resp_model.findAll(
      { 
      where :
      {
        study_id:req.params.studyId,
      },
      order:[
        ['createdAt', 'DESC']
       ],
       limit: 1
      }).then(result => {
        models.baby_resp=result[0]
      }).catch(err => {
           console.log("error :" ,err)
      })

      pReadingModels.baby_cv_model.findAll(
        { 
        where :
        {
          study_id:req.params.studyId,
        },
        order:[
          ['createdAt', 'DESC']
         ],
         limit: 1
        }).then(result => {
          models.baby_cv=result[0]
        }).catch(err => {
             console.log("error :" ,err)
        })

        pReadingModels.baby_cns_model.findAll(
          { 
          where :
          {
            study_id:req.params.studyId,
          },
          order:[
            ['createdAt', 'DESC']
           ],
           limit: 1
          }).then(result => {
            models.baby_cns=result[0]
          }).catch(err => {
               console.log("error :" ,err)
          })

          pReadingModels.baby_git_model.findAll(
            { 
            where :
            {
              study_id:req.params.studyId,
            },
            order:[
              ['createdAt', 'DESC']
             ],
             limit: 1
            }).then(result => {
              models.baby_git=result[0]
             
            }).catch(err => {
                 console.log("error :" ,err)
            })

            pReadingModels.baby_investigation_model.findAll(
              { 
              where :
              {
                study_id:req.params.studyId,
              },
              order:[
                ['createdAt', 'DESC']
               ],
               limit: 1
              }).then(result => {
                models.baby_investigation=result[0]
                
              }).catch(err => {
                   console.log("error :" ,err)
              })

              pReadingModels.baby_antibiotic_model.findAll(
                { 
                where :
                {
                  study_id:req.params.studyId,
                },
                order:[
                  ['createdAt', 'DESC']
                 ],
                 limit: 1
                }).then(result => {
                  models.baby_antibiotic=result[0]
                }).catch(err => {
                     console.log("error :" ,err)
                })

                pReadingModels.baby_final_model.findAll(
                  { 
                  where :
                  {
                    study_id:req.params.studyId,
                  },
                  order:[
                    ['createdAt', 'DESC']
                   ],
                   limit: 1
                  }).then(result => {
                    models.baby_final=result[0]
                    res.json( responseHelper.success(constant.success,models))
                  }).catch(err => {
                    res.json(responseHelper.serveError(constant.error_msg,err))
                  })

}

exports.updateBabyAppearsModel = (req, res , next)=>{

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }

  pReadingModels.baby_appear_model.findAll(
    { where :
      {
        study_id:req.params.study_id,
        reading :req.params.reading
      }
    }).then(result => {

      if(result.length == 0){
     
        res.json( responseHelper.notFound(constant.no_record_found))
  
       } else{

     result = mapper.babyAppearsMapper(result[0],req)

    //  res.json({
    //    result:result
    //  })

     return result.save()
       }
   })
   .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,result))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateBabyRespModel = (req,res,next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }
  pReadingModels.baby_resp_model.findAll(
    { where :
      {
        study_id:req.params.study_id,
        reading :req.params.reading
      }
    }).then(result => {

      console.log("baby resp model response :" , result)

      if(result.length == 0){
     
        res.json( responseHelper.notFound(constant.no_record_found))
  
       }else{
     var row = result[0]
     var baby_respiratory_support = JSON.parse(req.body.baby_respiratory_support); 
     row.groaning =  req.body.groaning,
     row.grunting = req.body.grunting,
     row.stridor = req.body.stridor,
     row.retraction = req.body.retraction,
     row.fast_breathing = req.body.fast_breathing,
     row.oxygen_saturation = req.body.oxygen_saturation,
     row.breathing_rate = req.body.breathing_rate,
     row.baby_chest_indrawing = req.body.baby_chest_indrawing,
     row.x_ray_result = req.body.x_ray_result,
     row.x_ray_status_done = req.body.x_ray_status_done,
     row.x_ray_status = req.body.x_ray_status,
     row.x_ray_diagnosis_any_other = req.body.x_ray_diagnosis_any_other,
     row.apnea_diagnosis = req.body.apnea_diagnosis,
     row.apnea_status = req.body.apnea_status,
     row.baby_respiratory_support =baby_respiratory_support,
     row.baby_respiratory_support_if_yes = req.body.baby_respiratory_support_if_yes,
     row.tab_name = req.body.tab_name
     return row.save()
       }
   })
   .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateBabyCVModel =(req,res,next)=>{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }
  pReadingModels.baby_cv_model.findAll(
    { where :
      {
        study_id:req.params.study_id,
        reading :req.params.reading
      }
    }).then(result => {
     if(result.length == 0){
     
      res.json( responseHelper.notFound(constant.no_record_found))

     }else{
     var row = result[0]
     row.heart_rate= req.body.heart_rate ,
     row.urine_output=req.body.urine_output,
     row.baby_blood_pressure_mean_arterial_bp= req.body.baby_blood_pressure_mean_arterial_bp,
     row.baby_blood_pressure_upper_limb=req.body.baby_blood_pressure_upper_limb ,
     row.baby_blood_pressure_lower_limb=req.body.baby_blood_pressure_lower_limb ,
     row.capillary_refill_unit=req.body.capillary_refill_unit ,
     row.low_peripheral_pulse_volume=req.body.low_peripheral_pulse_volume ,
     row.cool_peripheries=req.body.cool_peripheries,
     row.two_d_echo_done=req.body.two_d_echo_done ,
     row.two_d_echo_done_if_yes= req.body.two_d_echo_done_if_yes,
     row.baby_on_ionotropes= req.body.baby_on_ionotropes ,
     row.central_line= req.body.central_line,
     row.skin_pustules= req.body.skin_pustules,
     row.infusion_of_blood_products=req.body.infusion_of_blood_products
     return row.save()
     }
   })
   .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateBabyCNSModel = (req,res,next)=>{
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }
  pReadingModels.baby_cns_model.findAll(
    { where :
      {
        study_id:req.params.study_id,
        reading :req.params.reading
      }
    }).then(result => {
     if(result.length == 0){
     
      res.json( responseHelper.notFound(constant.no_record_found))

     }else{
     var row = result[0]
     row.features_of_encephalopathy= req.body.features_of_encephalopathy,
     row.seizures= req.body.seizures,
     row.abnormal_movements_like_tonic_posturing= req.body.abnormal_movements_like_tonic_posturing,
     row.af_bulge= req.body.af_bulge,
     row.tab_name= req.body.tab_name   
     return row.save()
     }
   })
   .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateBabyGITModel= (req,res,next)=>{
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }
  
  pReadingModels.baby_git_model.findAll(
    { where :
      {
        study_id:req.params.study_id,
        reading :req.params.reading
      }
    }).then(result => {
     if(result.length == 0){
      
      res.json( responseHelper.notFound(constant.no_record_found))

     }else{
     var row = result[0]
   row .abdominal_dystension= req.body.abdominal_dystension,
   row. frequency_of_stools= req.body.frequency_of_stools,
   row.diarrhea= req.body.diarrhea,
   row.vomiting= req.body.vomiting,
   row.feeding_intolerance= req.body.feeding_intolerance,
   row.baby_movement=req.body.baby_movement,
   row.tab_name= req.body.tab_name
     return row.save()
     }
   })
   .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateBabyInvestigationModel = (req,res,next)=>{

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }
  pReadingModels.baby_investigation_model.findAll(
    { where :
      {
        study_id:req.params.study_id,
        reading :req.params.reading
      }
    }).then(result => {
     if(result.length == 0){
    
      res.json( responseHelper.notFound(constant.no_record_found))

     }else{
     var row = result[0]
     row.baby_thyroid_status= req.body.baby_thyroid_status,
     row.baby_thyroid_result= req.body.baby_thyroid_result,
     row.baby_blood_glucose= req.body.baby_blood_glucose,
     row.baby_haemoglobin_levels= req.body.baby_haemoglobin_levels,
     row.baby_c_reactive_protien_levels= req.body.baby_c_reactive_protien_levels,
     row.micro_esr=req.body.micro_esr,
     row.baby_procalcitonin_levels=req.body.baby_procalcitonin_levels,
     row.total_leucocute_count_unit=req.body.total_leucocute_count_unit,
     row.total_leucocute_count=req.body.total_leucocute_count,
     row.absolute_neutrophil_count=req.body.absolute_neutrophil_count,
     row.absolute_neutrophil_count_unit=req.body.absolute_neutrophil_count_unit,
     row.immature_to_mature_neutrophil_ratios=req.body.immature_to_mature_neutrophil_ratios,
     row.thrombocytopenia_unit=req.body.thrombocytopenia_unit,
     row.thrombocytopenia=req.body.thrombocytopenia,
     row.urine_rest_for_pus_cells=req.body.urine_rest_for_pus_cells,
     row.urine_culture_test=req.body.urine_culture_test,
     row.blood_culture_report=req.body.blood_culture_report,
     row.gram_positive_bacteria=req.body.gram_positive_bacteria,
     row.gram_positive_bacteria_if_other=req.body.gram_positive_bacteria_if_other,
     row.gram_negative_bacteria=req.body.gram_negative_bacteria,
     row.gram_negative_bacteria_if_other=req.body.gram_negative_bacteria_if_other,
     row.fungi=req.body.fungi,
     row.other_organism=req.body.other_organism,
     row.antibiotic_status_resisitant=req.body.antibiotic_status_resisitant,
     row.antibiotic_status_intermediate=req.body.antibiotic_status_intermediate,
     row.antibiotic_status_value=req.body.antibiotic_status_value,
     row.sodium=req.body.sodium,
     row.potassium=req.body.potassium,
     row.chlorine=req.body.chlorine,
     row.calcium= req.body.calcium,
     row.phosphate= req.body.phosphate,
     row.magnesium=req.body.magnesium,
     row.urea=req.body.urea,
     row.creatinine=req.body.creatinine,
     row.lactate_levels=req.body.lactate_levels,
     row.bilirubin_levels=req.body.bilirubin_levels,
     row.cord_ph=req.body.cord_ph,
     row.arrhythmia=req.body.arrhythmia,
     row.csf_culture=req.body.csf_culture,
     row.csf_culture_tsb_value=req.body.csf_culture_tsb_value,
     row.tab_name=req.body.tab_name
     return row.save()
     }
   })
   .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateBabyAntibioticModel =(req,res,next)=>{
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }
  
  pReadingModels.baby_antibiotic_model.findAll(
    { where :
      {
        study_id:req.params.study_id,
        reading :req.params.reading
      }
    }).then(result => {
     if(result.length == 0){

      res.json( responseHelper.notFound(constant.no_record_found))

     }else{
     var row = result[0]
     row.antibiotic_given= req.body.antibiotic_given,
     row.date_of_administration_of_antiobiotic= req.body.date_of_administration_of_antiobiotic,
     row.time_of_administration_of_antiobiotic_hours=req.body.time_of_administration_of_antiobiotic_hours,
     row.time_of_administration_of_antiobiotic_minute=req.body.time_of_administration_of_antiobiotic_minute,
     row.antibiotic_name= req.body.antibiotic_name,
     row.antibiotic_name_if_other= req.body.antibiotic_name_if_other,
     row.date_of_blood_samples_sent_for_culture_test= req.body.date_of_blood_samples_sent_for_culture_test,
     row.time_of_blood_samples_sent_for_culture_test_hours= req.body.time_of_blood_samples_sent_for_culture_test_hours,
     row.time_of_blood_samples_sent_for_culture_test_minute= req.body.time_of_blood_samples_sent_for_culture_test_minute,
     row.blood_sample_taken_prior_to_antiobiotic_administration= req.body.blood_sample_taken_prior_to_antiobiotic_administration
     return row.save()
     }
   })
   .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateBabyFinalModel =(req,res,next)=>{  
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }
  pReadingModels.baby_final_model.findAll(
    { where :
      {
        study_id:req.params.study_id,
        reading :req.params.reading
      }
    }).then(result => {
     if(result.length == 0){
      
      res.json( responseHelper.notFound(constant.no_record_found))
   
    }else{
      var row = result[0]
      row.days_of_stay_in_hospital= req.body.days_of_stay_in_hospital,
      row.final_diagnosis_sepsis=req.body.final_diagnosis_sepsis,
      row.final_diagnosis_rds= req.body.final_diagnosis_rds,
      row.final_diagnosis_ttnb=req.body.final_diagnosis_ttnb,
      row.final_diagnosis_jaundice=req.body.final_diagnosis_jaundice,
      row.final_diagnosis_lbw=req.body.final_diagnosis_lbw,
      row.final_diagnosis_lga=req.body.final_diagnosis_lga,
      row.final_diagnosis_aga=req.body.final_diagnosis_aga,
      row.final_diagnosis_anemia= req.body.final_diagnosis_anemia,
      row.final_diagnosis_dextochordia=req.body.final_diagnosis_dextochordia,
      row.final_diagnosis_hypoglycemia=req.body.final_diagnosis_hypoglycemia,
      row.final_diagnosis_hypocalcemia=req.body.final_diagnosis_hypocalcemia,
      row.final_diagnosis_gastroenteritis=req.body.final_diagnosis_gastroenteritis,
      row.final_diagnosis_perinatal_respiratory_depression=req.body.final_diagnosis_perinatal_respiratory_depression,
      row.final_diagnosis_shock=req.body.final_diagnosis_shock,
      row.final_diagnosis_feeding_intolerence=req.body.final_diagnosis_feeding_intolerence,
      row.baby_discharge_date=req.body.baby_discharge_date,
      row.final_diagnosis_sga=req.body.final_diagnosis_sga,
      row.final_diagnosis_eos_los=req.body.final_diagnosis_eos_los,
      row.final_diagnosis_other=req.body.final_diagnosis_other
      return row.save()
     }
   })
   .then(result=>{
    res.json( responseHelper.success(constant.data_updated_successfully,req.body))
    })
    .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.generateReport=(req,res,next)=>{

// WHERE hospital_id =:hospital_id

  sequelize.query('SELECT * FROM vw_get_all_data',
  {
  // replacements: { 
  //     hospital_id:req.params.hospitalId
  // }, 
  type: sequelize.QueryTypes.SELECT }
  ).then(result => {
   
    result.forEach((data, index)=>{

      if(data.time_of_reading_hours == null){
        data.time_of_reading_hours='00'
      }
      if(data.time_of_reading_minute == null){
        data.time_of_reading_minute='00'
      }
      data.reading_time = data.time_of_reading_hours+":"+data.time_of_reading_minute
    })
  
    var filename='BMR Report.xlsx'

    var workbook = new excel.Workbook(); 

    var sheet = workbook.addWorksheet('Report'); 
    
    sheet.columns = [
      { header: 'Study Id', key: 'id' ,width:7   },
      { header: 'Hospital Name', key: 'hospital_name' ,width: 20   },
      { header: 'Hospital Branch Name', key: 'hospital_branch_name' ,width: 20   },
      { header: 'Baby Medical Record Number', key: 'baby_medical_record_number' ,width: 20   },
      { header: 'Baby Mother Medical Record Number', key: 'baby_mother_medical_record_number' ,width: 20   },
      { header: 'Type of Record', key: 'record_type' ,width: 20   },
      { header: 'Baby Admission Type', key: 'baby_admission_type' ,width: 20   },
      { header: 'Baby Birth Date', key: 'baby_birth_date' ,width: 20   },
      { header: 'Baby Place Of Birth Pin Code', key: 'baby_place_of_birth_pin_code' ,width: 20   },
      { header: 'Baby Place of Birth Name', key: 'baby_place_of_birth_name' ,width: 20   },
      { header: 'Baby Birth Time Hours', key: 'baby_birth_time_hours' ,width: 20   },
      { header: 'Baby Birth Time Minute', key: 'baby_birth_time_minit' ,width: 20   },
      { header: 'Baby Age at Admission', key: 'baby_age_of_admission' ,width: 20   },
      { header: 'Baby Apgar Score One Min', key: 'baby_apgar_score_one_min' ,width: 20   },
      { header: 'Baby Apgar Score Five Min', key: 'baby_apgar_score_five_min' ,width: 20   },
      { header: 'Baby Apgar Score Ten Min', key: 'baby_apgar_score_ten_min' ,width: 20   },
      { header: 'Baby Preterm', key: 'baby_preterm' ,width: 20   },
      { header: 'Diagnosis (EOS/LOS/NA)', key: 'baby_condition_yes_eos_los' ,width: 20   },
      { header: 'Diagnosis (RDS)', key: 'baby_condition_rds_yes_no' ,width: 20   },
      { header: 'Baby Gender', key: 'baby_gender' ,width: 20   },
      { header: 'Diagnosis (Jaundice)', key: 'baby_condition_jaundice_suspect' ,width: 20   },
      { header: 'Diagnosis (TTNB)', key: 'baby_condition_ttnb_suspect' ,width: 20   },
      { header: 'Diagnosis (LGA)', key: 'baby_condition_lga_suspect' ,width: 20   },
      { header: 'Diagnosis (AGA)', key: 'baby_condition_aga_suspect' ,width: 20   },
      { header: 'Diagnosis (SGA)', key: 'baby_condition_sga_suspect' ,width: 20   },
      { header: 'Diagnosis (Shock)', key: 'baby_shock_aga_suspect' ,width: 20   },
      { header: 'Diagnosis (Dextrocardia)', key: 'baby_condition_dextrocordia_suspect' ,width: 20   },
      { header: 'Diagnosis (Anemia)', key: 'baby_condition_anemia_suspect' ,width: 20   },
      { header: 'Diagnosis (LBW)', key: 'baby_condition_lbw_suspect' ,width: 20   },
      { header: 'Place of Delievery ', key: 'place_of_delivery' ,width: 20   },
      { header: 'Birth Facility', key: 'birth_facility' ,width: 20   },
      { header: 'Baby Gestational Age', key: 'baby_gestational_age' ,width: 20   },
      { header: 'Baby Geatational Age Unit', key: 'baby_gestational_age_unit' ,width: 20   },
      { header: 'Baby Weight At Birth', key:'baby_weight_at_birth' ,width: 20   },
      { header: 'Baby Condition Suspect', key: 'baby_condition_suspect' ,width: 20   },
      { header: 'Baby Day Of Event', key: 'baby_day_of_event' ,width: 20   },
      { header: 'Baby Weight At Admission', key: 'baby_weight_at_admission' ,width: 20   },
      { header: 'Baby Condition Other If Suspect', key: 'baby_condition_other_if_suspect' ,width: 20   },
      { header: 'Baby Diagnosis Perinatal', key: 'prelim_diagnosis_perinatal' ,width: 20   },
      { header: 'Prelim Diagnosis Hypoglycemia', key: 'prelim_diagnosis_hypoglycemia' ,width: 20   },
      { header: 'Prelim Diagnosis Hypocalcemia ', key: 'prelim_diagnosis_hypocalcemia' ,width: 20   },
      { header: 'Prelim Diagnosis Feeding Intolerence', key: 'prelim_diagnosis_feeding_intolerence' ,width: 20   },
      { header: 'Prelim Diagnosis Gastroenteritis', key: 'prelim_diagnosis_gastroenteritis' ,width: 20   },
      { header: 'Baby Weight At Admission Unit', key: 'baby_weight_at_admission_unit' ,width: 20   },
      { header: 'Baby Date Of Admission', key: 'baby_date_of_admission' ,width: 20   },
      { header: 'Mother Age', key: 'mother_age' ,width: 20   },
      { header: 'Mother Weight Unit', key: 'mother_weight_unit' ,width: 20   },
      { header: 'Mother Weight', key: 'mother_weight' ,width: 20   },
      { header: 'Mother Height', key: 'mother_height' ,width: 20   },
      { header: 'Mother Height Unit', key: 'mother_height_unit' ,width: 20   },
      { header: 'Mother Haemoglobin', key: 'mother_haemoglobin' ,width: 20   },
      { header: 'Mother Bmi', key: 'mother_bmi' ,width: 20   },
      { header: 'Maternal Blood Pressure', key: 'maternal_blood_pressure' ,width: 20   },
      { header: 'Maternal Blood Pressure Diastolic', key: 'maternal_blood_pressure_diastolic' ,width: 20   },
      { header: 'Maternal Diabetes', key: 'maternal_diabetes' ,width: 20   },
      { header: 'Maternal Fever', key: 'maternal_fever' ,width: 20   },
      { header: 'Maternal Fever Unit', key: 'maternal_fever_unit' ,width: 20   },
      { header: 'Maternal Fever Basic', key: 'maternal_fever_basic' ,width: 20   },
      { header: 'Maternal Thyroid Function', key: 'maternal_thyroid_function' ,width: 20   },
      { header: 'Maternal Thyroid Function Basic', key: 'maternal_thyroid_function_basic' ,width: 20   },
      { header: 'Maternal Thyroid Function Unit Basic', key: 'maternal_thyroid_function_unit_basic' ,width: 20   },
      { header: 'Maternal Thyroid Function Unit Basic Unit', key: 'maternal_thyroid_function_unit_basic_unit' ,width: 20   },
      { header: 'More Than Vaginal Examinations During Labor', key: 'more_than_3_vaginal_examinations_during_labor' ,width: 20   },
      { header: 'Rupture Of Membranes Rom One', key: 'rupture_of_membranes_rom_one' ,width: 20   },
      { header: 'Leaking pv', key: 'leaking_pv' ,width: 20   },
      { header: 'Rupture Of Membranes Rom', key: 'rupture_of_membranes_rom' ,width: 20   },
      { header: 'Smelly Amniotic Fluid', key: 'smelly_amniotic_fluid' ,width: 20   },
      { header: 'Chorioamnionitis', key: 'chorioamnionitis' ,width: 20   },
      { header: 'Gbs Infection', key: 'gbs_infection' ,width: 20   },
      { header: 'Colonisation Or Urinary Tract Infection', key: 'colonisation_or_urinary_tract_infection' ,width: 20   },
      { header: 'Torch Infections', key: 'torch_infections' ,width: 20   },
      { header: 'Type Of Delivery', key: 'type_of_delivery' ,width: 20   },
      { header: 'Delayed Cord Clamping', key: 'delayed_cord_clamping' ,width: 20   },
      { header: 'Vaginal Swab Culture Two', key: 'vaginal_swab_culture_two' ,width: 20   },
      { header: 'Vaginal Swab Culture Three', key: 'vaginal_swab_culture_three' ,width: 20   },
      { header: 'Amniotic Fluid Culture', key: 'amniotic_fluid_culture' ,width: 20   },
      { header: 'Amniotic Fluid Culture Three', key: 'amniotic_fluid_culture_three' ,width: 20   },
      { header: 'Amniotic Fluid Culture Two', key: 'amniotic_fluid_culture_two' ,width: 20   },
      { header: 'Rupture Of Membranes Rom Two', key: 'rupture_of_membranes_rom_two' ,width: 20   },
      { header: 'Vaginal Swab Culture', key: 'vaginal_swab_culture' ,width: 20   },
      { header: 'Baby Appearance', key: 'baby_appearance' ,width: 20   },
      { header: 'Baby Skin Colour', key: 'baby_skin_colour' ,width: 20   },
      { header: 'Baby Cry Sound', key: 'baby_cry_sound' ,width: 20   },
      { header: 'Baby Cry Sound Status', key: 'baby_cry_sound_status' ,width: 20   },
      { header: 'Hypotonia Muscular Response One Min After Birth', key: 'hypotonia_muscular_response_one_min_after_birth' ,width: 20   },
      { header: 'Hypotonia Muscular Response Five Min After Birth', key: 'hypotonia_muscular_response_five_min_after_birth' ,width: 20   },
      { header: 'Excessive Sleeping', key: 'excessive_sleeping' ,width: 20   },
      { header: 'Hypothermia', key: 'hypothermia' ,width: 20   },
      { header: 'Hypothermia Status Value', key: 'hypothermia_status_value' ,width: 20   },
      { header: 'Baby Feeding Status', key: 'baby_feeding_status' ,width: 20   },
      { header: 'Baby Jaundice', key: 'baby_jaundice' ,width: 20   },
      { header: 'Breast Feeding Initiation', key: 'breast_feeding_initiation' ,width: 20   },
      { header: 'Kangaroo Mother Care', key: 'kangaroo_mother_care' ,width: 20   },
      { header: 'Umbilical Discharge', key: 'umbilical_discharge' ,width: 20   },
      { header: 'Hypothermia Status', key: 'hypothermia_status' ,width: 20   },
      { header: 'Groaning', key: 'groaning' ,width: 20   },
      { header: 'Grunting', key: 'grunting' ,width: 20   },
      { header: 'Stridor', key: 'stridor' ,width: 20   },
      { header: 'Retraction', key: 'retraction' ,width: 20   },
      { header: 'Fast Breathing', key: 'fast_breathing' ,width: 20   },
      { header: 'Oxygen Saturation', key: 'oxygen_saturation' ,width: 20   },
      { header: 'Breathing Rate', key: 'breathing_rate' ,width: 20   },
      { header: 'Baby Chest Indrawing', key: 'baby_chest_indrawing' ,width: 20   },
      { header: 'Xray Status Done', key: 'x_ray_status_done' ,width: 20   },
      { header: 'Xray Result', key: 'x_ray_result' ,width: 20   },
      { header: 'Xray Diagnosis Any Other', key: 'x_ray_diagnosis_any_other' ,width: 20   },
      { header: 'Apnea Status', key: 'apnea_status' ,width: 20   },
      { header: 'Apnea Diagnosis', key: 'apnea_diagnosis' ,width: 20   },
      { header: 'Baby Respiratory Support', key: 'baby_respiratory_support' ,width: 20   },
      { header: 'Baby Respiratory Support If Yes', key: 'baby_respiratory_support_if_yes' ,width: 20   },
      { header: 'Heart Rate', key: 'heart_rate' ,width: 20   },
      { header: 'Urine Output', key: 'urine_output' ,width: 20   },
      { header: 'Baby Blood Pressure Mean Arterial Bp', key: 'baby_blood_pressure_mean_arterial_bp' ,width: 20   },
      { header: 'Baby Blood Pressure Upper Limb', key: 'baby_blood_pressure_upper_limb' ,width: 20   },
      { header: 'Baby Blood Pressure Lower Limb', key: 'baby_blood_pressure_lower_limb' ,width: 20   },
      { header: 'Capillary Refill Unit', key: 'capillary_refill_unit' ,width: 20   },
      { header: 'Low Peripheral Pulse Volume', key: 'low_peripheral_pulse_volume' ,width: 20   },
      { header: 'Cool Peripheries', key: 'cool_peripheries' ,width: 20   },
      { header: 'Two Echo Done', key: 'two_d_echo_done' ,width: 20   },
      { header: 'Two Echo Done If Yes', key: 'two_d_echo_done_if_yes' ,width: 20   },
      { header: 'Baby On Ionotropes', key: 'baby_on_ionotropes' ,width: 20   },
      { header: 'Central Line', key: 'central_line' ,width: 20   },
      { header: 'Skin Pustules', key: 'skin_pustules' ,width: 20   },
      { header: 'Infusion Of Blood Products', key: 'infusion_of_blood_products' ,width: 20   },
      { header: 'Features Of Encephalopathy', key: 'features_of_encephalopathy' ,width: 20   },
      { header: 'Seizures', key: 'seizures' ,width: 20   },
      { header: 'Abnormal Movements Like Tonic Posturing', key: 'abnormal_movements_like_tonic_posturing' ,width: 20   },
      { header: 'Af Bulge', key: 'af_bulge' ,width: 20   },
      { header: 'Abdominal Dystension', key: 'abdominal_dystension' ,width: 20   },
      { header: 'Frequency Of Stools', key: 'frequency_of_stools' ,width: 20   },
      { header: 'Diarrhea', key: 'diarrhea' ,width: 20   },
      { header: 'Vomiting', key: 'vomiting' ,width: 20   },
      { header: 'Feeding Intolerance', key: 'feeding_intolerance' ,width: 20   },
      { header: 'Baby Movement', key: 'baby_movement' ,width: 20   },
      { header: 'Baby Thyroid Status', key: 'baby_thyroid_status' ,width: 20   },
      { header: 'Baby Thyroid Result', key: 'baby_thyroid_result' ,width: 20   },
      { header: 'Baby Blood Glucose', key: 'baby_blood_glucose' ,width: 20   },
      { header: 'Baby Haemoglobin Levels', key: 'baby_haemoglobin_levels' ,width: 20   },
      { header: 'Baby Reactive Protien Levels', key: 'baby_c_reactive_protien_levels' ,width: 20   },
      { header: 'Micro Esr', key: 'micro_esr' ,width: 20   },
      { header: 'Baby Procalcitonin Levels', key: 'baby_procalcitonin_levels' ,width: 20   },
      { header: 'Total Leucocute Count Unit', key: 'total_leucocute_count_unit' ,width: 20   },
      { header: 'Total Leucocute Count', key: 'total_leucocute_count' ,width: 20   },
      { header: 'Absolute Neutrophil Count', key: 'absolute_neutrophil_count' ,width: 20   },
      { header: 'Absolute Neutrophil Count Unit', key: 'absolute_neutrophil_count_unit' ,width: 20   },
      { header: 'Immature To Mature Neutrophil Ratios', key: 'immature_to_mature_neutrophil_ratios' ,width: 20   },
      { header: 'Thrombocytopenia_unit', key: 'thrombocytopenia_unit' ,width: 20   },
      { header: 'Thrombocytopeni', key: 'thrombocytopenia' ,width: 20   },
      { header: 'Urine Rest For Pus Cells', key: 'urine_rest_for_pus_cells' ,width: 20   },
      { header: 'Urine Culture Test', key: 'urine_culture_test' ,width: 20   },
      { header: 'Blood Culture Report', key: 'blood_culture_report' ,width: 20   },
      { header: 'Gram Positive Bacteria', key: 'gram_positive_bacteria' ,width: 20   },
      { header: 'Gram Negative Bacteria', key: 'gram_negative_bacteria' ,width: 20   },
      { header: 'Gram Positive Bacteria If Other', key: 'gram_positive_bacteria_if_other' ,width: 20   },
      { header: 'Gram Negative Bacteria If Other', key: 'gram_negative_bacteria_if_other' ,width: 20   },
      { header: 'Fungi', key: 'fungi' ,width: 20   },
      { header: 'Other Organism', key: 'other_organism' ,width: 20   },
      { header: 'Other Organism', key: 'other_organism' ,width: 20   },
      { header: 'Sodium', key: 'sodium' ,width: 20   },
      { header: 'Potassium', key: 'potassium' ,width: 20   },
      { header: 'Chlorine', key: 'chlorine' ,width: 20   },
      { header: 'Calcium', key: 'calcium' ,width: 20   },
      { header: 'Phosphate', key: 'phosphate' ,width: 20   },
      { header: 'Magnesium', key: 'magnesium' ,width: 20   },
      { header: 'Urea', key: 'urea' ,width: 20   },
      { header: 'Creatinine', key: 'creatinine' ,width: 20   },
      { header: 'Lactate Levels', key: 'lactate_levels' ,width: 20   },
      { header: 'Bilirubin Levels', key: 'bilirubin_levels' ,width: 20   },
      { header: 'Cord Ph', key: 'cord_ph' ,width: 20   },
      { header: 'Arrhythmia', key: 'arrhythmia' ,width: 20   },
      { header: 'Csf Culture', key: 'csf_culture' ,width: 20   },
      { header: 'Csf Culture Tsb Value', key: 'csf_culture_tsb_value' ,width: 20   },
      { header: 'Antibiotic Status Value', key: 'antibiotic_status_value' ,width: 20   },
      { header: 'Antibiotic Given', key: 'antibiotic_given' ,width: 20   },
      { header: 'Date Of Administration Of Antiobiotic', key: 'date_of_administration_of_antiobiotic' ,width: 20   },
      { header: 'Time Of Administration Of Antiobiotic Hours', key: 'time_of_administration_of_antiobiotic_hours' ,width: 20   },
      { header: 'Time Of Administration Of Antiobiotic Minute', key: 'time_of_administration_of_antiobiotic_minute' ,width: 20   },
      { header: 'Antibiotic Name', key: 'antibiotic_name' ,width: 20   },
      { header: 'Antibiotic Name If Other', key: 'antibiotic_name_if_other' ,width: 20   },
      { header: 'Grade Of Antibiotic', key: 'grade_of_antibiotic' ,width: 20   },
      { header: 'Date Of Blood Samples Sent For Culture Test', key: 'date_of_blood_samples_sent_for_culture_test' ,width: 20   },
      { header: 'Time Of Blood Samples Sent For Culture Test Hours', key: 'time_of_blood_samples_sent_for_culture_test_hours' ,width: 20   },
      { header: 'Time Of Blood Samples Sent For Culture Test Minute', key: 'time_of_blood_samples_sent_for_culture_test_minute' ,width: 20   },
      { header: 'Blood Sample Taken Prior To Antiobiotic Administration', key: 'blood_sample_taken_prior_to_antiobiotic_administration' ,width: 20   },
      { header: 'Days Of Stay In Hospital', key: 'days_of_stay_in_hospital' ,width: 20   },
      { header: 'Final Diagnosis Sepsis', key: 'final_diagnosis_sepsis' ,width: 20   },
      { header: 'Final Diagnosis Rds', key: 'final_diagnosis_rds' ,width: 20   },
      { header: 'Final Diagnosis Ttnb', key: 'final_diagnosis_ttnb' ,width: 20   },
      { header: 'Final Diagnosis Jaundice', key: 'final_diagnosis_jaundice' ,width: 20   },
      { header: 'Final Diagnosis Lbw', key: 'final_diagnosis_lbw' ,width: 20   },
      { header: 'Final Diagnosis Lga', key: 'final_diagnosis_lga' ,width: 20   },
      { header: 'Final Diagnosis Aga', key: 'final_diagnosis_aga' ,width: 20   },
      { header: 'Final Diagnosis Sga', key: 'final_diagnosis_sga' ,width: 20   },
      { header: 'Final Diagnosis Anemia', key: 'final_diagnosis_anemia' ,width: 20   },
      { header: 'Final Diagnosis Dextochordia', key: 'final_diagnosis_dextochordia' ,width: 20   },
      { header: 'Final Diagnosis Hypoglycemia', key: 'final_diagnosis_hypoglycemia' ,width: 20   },
      { header: 'Final Diagnosis Hypocalcemia', key: 'final_diagnosis_hypocalcemia' ,width: 20   },
      { header: 'Final Diagnosis Gastroenteritis', key: 'final_diagnosis_gastroenteritis' ,width: 20   },
      { header: 'Final Diagnosis Perinatal Respiratory Depression', key: 'final_diagnosis_perinatal_respiratory_depression' ,width: 20   },
      { header: 'Final Diagnosis Shock', key: 'final_diagnosis_shock' ,width: 20   },
      { header: 'Final Diagnosis Feeding Intolerence', key: 'final_diagnosis_feeding_intolerence' ,width: 20   },
      { header: 'Baby Discharge Date', key: 'baby_discharge_date' ,width: 20   },
      { header: 'Antibiotic Status Resisitant', key: 'antibiotic_status_resisitant' ,width: 20   },
      { header: 'Antibiotic Status Intermediate', key: 'antibiotic_status_intermediate' ,width: 20   },
      { header: 'Baby Weight At Birth Unit', key: 'baby_weight_at_birth_unit' ,width: 20   },
      { header: 'Final Diagnosis Eos Los', key: 'final_diagnosis_eos_los' ,width: 20   },
      { header: 'Final Diagnosis Other', key: 'final_diagnosis_other' ,width: 20   },
      { header: 'Reading', key: 'reading' ,width: 20   },
      { header: 'Reading Date', key: 'reading_date' ,width: 20},
      { header: 'Reading Time', key: 'reading_time',width: 20},
      { header: 'Date of entry', key: 'createdAt' ,width: 10},
     ]
    
      result.forEach((data,index)=>{
        sheet.addRow(data)
       })
     
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + filename)
       
        workbook.xlsx.write(res)
            .then(function (data) {
            });
        })

  .catch(err => {
      res.json(responseHelper.serveError(constant.error_msg,err))
   })
}

exports.saveBabyMedicalRecord=(req,res,next)=>{

  var patientBasicInfos = {
    hospital_id:req.params.hospitalId,
    hospital_branch_id:req.params.hospitalBranchId,
    baby_medical_record_number:req.body.bmrn,
    baby_mother_medical_record_number:req.body.mmrn,
    deleted_flag:0,
    active_flag:1
  }

  var patient = {
    baby_name:req.body.babyName,
    mother_name:req.body.motherName ,
    father_name:req.body.fatherName ,
    primary_contact_no:req.body.contactNumberPrimary ,
    secondary_contact_no:req.body.contactNumberSecondary ,
    address :req.body.address ,
    city:req.body.city ,
    state :req.body.state ,
    pincode : req.body.pincode,
    nationality :req.body.nationality ,
    email_id :req.body.email ,
    active_flag :req.body.status ,
    created_by:enumConst.userType.hospital_branch,
    deleted_flag:0 
    }
  
  pReadingModels.basic_model.findAll({
      where:{
        baby_medical_record_number:req.body.bmrn
      }
  }).then(result => {
      if(result.length >0){
         res.json( responseHelper.alreadyExist('Baby medical record already exist',result))
      }
      return result
  })
  .then(result=>{
    pReadingModels.basic_model.create(patientBasicInfos)
    .then(result=>{
      if(result != null){
        patient.study_id = result.id
        patient = pReadingModels.patient_model.create(patient)
      }
      return patient
    })
  })
  .then(result =>{
    res.json( responseHelper.success(constant.success,result))
  })
  .catch(err =>{
    res.json(responseHelper.serveError(constant.error_msg,err))
  })
  
}


exports.getBabyMedicalRecord=async(req,res,next)=>{

  var start = (req.params.start-1)*req.params.end
  var hospital_id=req.params.hospitalId
  var hospital_branch_id=req.params.hospitalBranchId

  var result = await sequelize.query('SELECT '+
  ' patient_infos.baby_name,patient_infos.mother_name, '+
  ' patient_infos.father_name,patient_infos.primary_contact_no,patient_infos.secondary_contact_no,patient_infos.createdAt,patient_infos.updated_by, '+
  ' patient_infos.address,patient_infos.city,patient_infos.state,patient_infos.pincode, '+
  ' patient_infos.nationality,patient_infos.email_id,patient_infos.study_id, '+
  ' patient_infos.active_flag AS status , patient_infos.patient_id,patient_infos.created_by, '+
  ' patient_basic_infos.hospital_id,patient_basic_infos.hospital_name,patient_basic_infos.hospital_branch_id, '+
  ' patient_basic_infos.baby_medical_record_number,patient_basic_infos.baby_mother_medical_record_number, '+
  ' m_hospitals_branches.branch_name,patient_basic_infos.id AS patient_basic_infos_id '+
  ' FROM patient_infos '+
  ' JOIN patient_basic_infos ON patient_basic_infos.id=patient_infos.study_id '+
  ' JOIN m_hospitals_branches ON  m_hospitals_branches.hospital_branch_id=patient_basic_infos.hospital_branch_id '+
  ' WHERE patient_basic_infos.hospital_id=:hospital_id AND patient_basic_infos.hospital_branch_id=:hospital_branch_id '+
  ' LIMIT ' + req.params.end +' OFFSET ' +start,
  { replacements: { 
    hospital_id:hospital_id,
    hospital_branch_id:hospital_branch_id
  }, type: sequelize.QueryTypes.SELECT }
  )






  // var finalResult = function (result) {
  //   return new Promise(function (resolve, reject) {
  //     result.forEach(async(data,index)=>{
  //       var babyAppear = await pReadingModels.baby_appear_model.findAll({
  //          where:{
  //            study_id:data.study_id
  //          },
  //          order:[
  //            ['createdAt', 'DESC']
  //           ],
  //           limit: 1
  //          })
  //           data.reading=babyAppear[0].reading
  //          })
  //       resolve(false);
  //   });
  // }

   result.forEach(async(data,index)=>{
     var babyAppear = await pReadingModels.baby_appear_model.findAll({
        where:{
          study_id:data.study_id
        },
        order:[
          ['createdAt', 'DESC']
         ],
         limit: 1
        })
         data.reading=babyAppear[0].reading
        })

   setTimeout(function() {
      res.json( responseHelper.success(constant.success,result))
   }, 200);
}

exports.updateBabyMedicalRecord =(req,res,next) =>{
  pReadingModels.basic_model.findOne({
    where :{
      id:req.params.studyId
    }
  })
.then(result=>{
 if(result!=null){
 result.hospital_id=req.params.hospitalId
 result.hospital_branch_id=req.params.hospitalBranchId
 result.hospital_name=req.body.hospital_name
 result.hospital_branch_name=req.body.hospital_branch_name
 result.baby_medical_record_number=req.body.bmrn
 result.baby_mother_medical_record_number=req.body.mmrn
 
 return result.save()
    }
  })
.then(result=>{
if(result!=null){
 var patientResult=pReadingModels.patient_model.findOne({
    where:{
      patient_id:req.params.patientId
    }
  })
 return patientResult
 }
})
.then(patientResult =>{
  patientResult.baby_name=req.body.babyName
  patientResult.mother_name=req.body.motherName
  patientResult.father_name=req.body.fatherName
  patientResult.state=req.body.state
  patientResult.address=req.body.address
  patientResult.city=req.body.city
  patientResult.nationality=req.body.nationality
  patientResult.email_id=req.body.email
  patientResult.primary_contact_no=req.body.contactNumberPrimary
  patientResult.secondary_contact_no=req.body.contactNumberSecondary
  patientResult.pincode=req.body.pincode
  patientResult.updated_by=enumConst.userType.hospital_branch
  patientResult.active_flag=req.body.status
  return patientResult.save()
})
.then(patientResult=>{
  res.json( responseHelper.success(constant.success,patientResult))
  })
.catch(err =>{
  res.json(responseHelper.serveError(constant.error_msg,err))
 })
} 


exports.babyMedicalRecordCount=(req,res,next)=>{
  pReadingModels.basic_model
  .findAndCountAll({
     where: {
      hospital_id:req.params.hospitalId,
      hospital_branch_id:req.params.hospitalBranchId,
      deleted_flag:0
     }   
   })
  .then(result => {
    res.json( responseHelper.success(constant.success,{medical_record_count:result.count}))
  })
  .catch(err =>{
    res.json(responseHelper.serveError(constant.error_msg,err))
  })
}