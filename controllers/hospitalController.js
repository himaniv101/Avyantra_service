const pReadingModels = require('../sequelize')
const {validationResult} = require('express-validator/check')
const responseHelper = require('../helper/res')
const constant = require('../helper/constant')
const {sequelize} = require('../sequelize')
const queries = require('../helper/queries')
const mapper = require('../mapper/mapper')
const enumConst = require('../helper/enum')

exports.add=(a ,b)=>{
 sum = a+b
return sum 
}



exports.hospitalSignUp = (req,res,next)=>{

  var user ={}
  user = mapper.userMapper(user,req)

  var hospital={}
  hospital = mapper.hospitalMapper(hospital,req)

  var roles ={}
  roles= mapper.roleMapper(roles,req)

  pReadingModels.user_model.findAll({
    where :{
        user_name: req.body.username,
        password : req.body.password
    }
}).then(result => {
    if(result.length >0){
       res.json( responseHelper.alreadyExist(constant.user_already_exit,result))
    }
    return result
})
.then(result =>{

    pReadingModels.user_model.create(user)
    .then(result => {
        if(!result.isEmpty){
           roles.user_id=result.user_id
           roles.role_id = enumConst.roles.hospital_admin
           hospital.user_id=result.user_id
    
            pReadingModels.hospital_model.create(hospital)
            .then(result => {
            if(!result.isEmpty){
               console.log('hospital saved successfully :' , result) 
            }
            })
            pReadingModels.user_role_model.create(roles).then(result=>{
                if(!result.isEmpty){
                    res.json( responseHelper.success(constant.successfully_registered,req.body))
                }
            })
        }
    })
})
.catch(err=>{
    res.json(responseHelper.serveError(constant.error_msg,err))})
}

exports.addRole= (req,res,next)=>{

    var roles ={}
    roles= mapper.hospitalRoleMapper(roles,req)

    pReadingModels.role_model.create(roles).then(result=>{
        if(!result.isEmpty){
            res.json( responseHelper.success(constant.role_add_successfully,result))
        }
    }).catch(err=>{
         res.json(responseHelper.serveError(constant.error_msg,err))
    })

}

exports.getHospitalProfile = (req, res, next)=>{

    sequelize.query('SELECT m_hospitals.hospital_id,m_hospitals.user_id,m_hospitals.hospital_name, '+
   ' m_users.address,m_users.city, m_users.contact_number,m_users.email_address, m_users.pincode, m_users.state, m_users.user_name, m_users.password '+
   ' FROM m_hospitals '+
   ' JOIN m_users ON m_hospitals.user_id = m_users.user_id '+
   ' WHERE m_hospitals.hospital_id = :hospital_id ',
    { replacements: { 
        hospital_id:req.params.hospitalId,
    }, type: sequelize.QueryTypes.SELECT }
    ).then(result => {
        res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.updateHospitalProfile =(req,res,next)=>{


    pReadingModels.user_model.findOne({
        where:{
            user_id:req.body.user_id
        }
    })
    .then(result=>{

        if(result == null){
            res.json( responseHelper.notFound(constant.no_record_found,result))
        }
   result.address = req.body.address
   result.city= req.body.city
   result.contact_number=req.body.contact_number
   result.email_address=req.body.email_address
   result.pincode=req.body.pincode
   result.state=req.body.state
   result.user_name=req.body.user_name
   result.password=req.body.password
   return result.save()
    })
    .then(result =>{

     var hospitalResult =  pReadingModels.hospital_model.findOne({
            where:{
                hospital_id:req.params.hospitalId
            }
        })

        return hospitalResult
    })
    .then(result =>{

       result.hospital_name= req.body.hospital_name
       return result.save()
    })
    .then(result=>{
        
        res.json( responseHelper.success(constant.hospital_profile_updated_successfully,result))

    })
    .catch(err=>{
        
        res.json(responseHelper.serveError(constant.error_msg,err))

    })

}

exports.getRegisteredRefferal=(req,res,next)=>{

    var start = (req.params.start-1)*req.params.end
    var referralIds =[]
    sequelize.query('SELECT m_referral_doctors.referral_id, m_referral_doctors.first_name,m_referral_doctors.last_name, '+
    ' m_users.address,m_users.city,m_users.contact_number,m_users.email_address,m_users.state,m_users.user_name,m_users.password '+
    ' FROM m_referral_doctors '+
    ' JOIN m_users ON m_users.user_id = m_referral_doctors.user_id ' +
    ' LIMIT ' + req.params.end +' OFFSET ' +start,
     { type: sequelize.QueryTypes.SELECT }
      )
      .then(result=>{
        if(result.length > 0){
            result.forEach((data,index)=>{
                referralIds.push(data.referral_id)
            })
        sequelize.query('SELECT m_status.status_name AS hospital_initiation_status ,ms.status_name AS  refferal_initiation_status,map_referral_hospitals.referral_action_status,map_referral_hospitals.hospital_id ,map_referral_hospitals.referral_hospital_id,map_referral_hospitals.referral_id , map_referral_hospitals.hospital_action_status  FROM map_referral_hospitals '+
        ' JOIN m_status ON m_status.status_id = map_referral_hospitals.hospital_action_status '+
        ' JOIN m_status ms ON  ms.status_id = map_referral_hospitals.referral_action_status '+
        ' WHERE map_referral_hospitals.referral_id  IN ('+referralIds+') AND map_referral_hospitals.hospital_id =:hospital_id ',
        { replacements: { 
            hospital_id:req.params.hospitalId
         },type: sequelize.QueryTypes.SELECT })
         .then(referralHospitalResult =>{
       for(var i =0 ; i<result.length;i++){
           result[i].hospital_initiation_status='Request Initiation'
           result[i].hospital_initiation_status_id =1
           result[i].referral_hospital_id=null
           result[i].referral_initiation_status='Request Initiation'
           result[i].refferal_initiation_status_id =1
      }
            if(referralHospitalResult.length > 0){

                for(var i =0;i<result.length;i++){

                for(var j=0;j<referralHospitalResult.length;j++){

                 if(result[i].referral_id==referralHospitalResult[j].referral_id){
                    result[i].hospital_initiation_status=referralHospitalResult[j].hospital_initiation_status
                    result[i].hospital_initiation_status_id =referralHospitalResult[j].hospital_action_status
                    result[i].referral_hospital_id=referralHospitalResult[j].referral_hospital_id
                    result[i].referral_initiation_status=referralHospitalResult[j].refferal_initiation_status
                    result[i].refferal_initiation_status_id =referralHospitalResult[j].referral_action_status
                 } 
               }
            }
         }
         return result
    })
    .then(result => {
        res.json( responseHelper.success(constant.success,result))
     }).catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
  }
 })






















   /* sequelize.query('SELECT m_status.status_name AS hospital_initiation_status , '+
     'ms.status_name AS  refferal_initiation_status ,'+
    ' map_referral_hospitals.hospital_id ,'+
     'map_referral_hospitals.referral_hospital_id,'+
    ' map_referral_hospitals.referral_id ,m_hospitals.hospital_name,'+
    ' map_referral_hospitals.hospital_action_status ,'+
    ' map_referral_hospitals.referral_action_status , '+
    ' m_referral_doctors.first_name , m_referral_doctors.last_name, m_users.contact_number, m_users.email_address,m_users.address,m_users.user_name '+
    ' FROM map_referral_hospitals  '+
    'JOIN  m_referral_doctors ON m_referral_doctors.referral_id = map_referral_hospitals.referral_id '+
    'JOIN m_users ON m_users.user_id = m_referral_doctors.user_id'+
    ' JOIN m_status ON m_status.status_id = map_referral_hospitals.hospital_action_status '+
    ' JOIN  m_hospitals ON  m_hospitals.hospital_id = map_referral_hospitals.hospital_id '+
    ' JOIN m_status ms ON  ms.status_id = map_referral_hospitals.referral_action_status '+
    ' WHERE map_referral_hospitals.hospital_id =:hospitalId AND requester_type = 5',
     { replacements: { 
        hospitalId:req.params.hospitalId,
     }, type: sequelize.QueryTypes.SELECT }
     ).then(result => {
         res.json( responseHelper.success(constant.success,result))
     })
     .catch(err => {
         res.json(responseHelper.serveError(constant.error_msg,err))
      })*/
}

exports.getRefferalCount =(req,res,next) =>{

    pReadingModels.referral_hospitals_model
    .findAndCountAll({
       where: {
        hospital_id:req.params.hospitalId,
        created_by:5
       }   
     })
    .then(result => {
      res.json( responseHelper.success(constant.success,{refferal_count:result.count}))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}


