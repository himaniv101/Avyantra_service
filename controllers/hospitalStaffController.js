const pReadingModels = require('../sequelize')
const {validationResult} = require('express-validator/check')
const responseHelper = require('../helper/res')
const constant = require('../helper/constant')
const {sequelize} = require('../sequelize')
const queries = require('../helper/queries')
const mapper = require('../mapper/mapper')
const enumConst = require('../helper/enum')
const util = require('../helper/util')
const excel = require('exceljs');
const nodeMailer = require('nodemailer');

exports.getHospitalStaffRoles =(req,res,next)=>{
    sequelize.query('SELECT m_hospital_branch_roles.id AS hospital_branch_roles_id ,m_roles.role_id ,m_roles.role ,m_hospital_branch_roles.hospital_id, m_hospital_branch_roles.hospital_branch_id  FROM  m_roles JOIN m_hospital_branch_roles ON m_roles.role_id = m_hospital_branch_roles.role_id WHERE hospital_id =:hospital_id',
    { replacements: { 
        hospital_id:req.params.hospitalId
    }, type: sequelize.QueryTypes.SELECT }
    ).then(result => {

console.log("result :" , result)

      res.json({
          result:result
      })
        res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.getHospitalStaffSpecialities =(req,res,next)=>{
    sequelize.query('SELECT m_hospital_branch_specialities.id AS  hospital_branch_speciality_id ,m_specialities.speciality_id , m_specialities.speciality , m_hospital_branch_specialities.hospital_id,m_hospital_branch_specialities.hospital_branch_id FROM m_specialities  JOIN m_hospital_branch_specialities ON m_specialities.speciality_id = m_hospital_branch_specialities.speciality_id WHERE  hospital_id =:hospital_id',
    { replacements: { 
        hospital_id:req.params.hospitalId
    }, type: sequelize.QueryTypes.SELECT }
    ).then(result => {
        res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.getHospitalBranchesByHospitalId =(req,res,next)=>{
   
    pReadingModels.hospital_branch_model.findAll({
        where:{
            hospital_id:req.params.hospitalId
        },
        attributes: ['hospital_branch_id','branch_name','user_id','hospital_id']
    })
    .then(result=>{
        res.json( responseHelper.success(constant.success,result))
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.addStaff=(req,res,next)=>{

    var staffUser ={}
    var staff={}
    var staffHospitalMapper={}
    var staffPermission={}

    staffUser = mapper.staffUserMapper(staffUser,req)

        pReadingModels.user_model.findAll({
            where:{
                user_name: req.body.username,
                password : req.body.password,
                contact_number: req.body.contactNumber,
                email_address:req.body.email
            }
        }).then(result => {

         
            if(result.length >0){
               res.json( responseHelper.alreadyExist('Staff already exit',result))
            }
            return result
        }).then(result=>{

            pReadingModels.user_model.create(staffUser)
            .then(result=>{
                   
                if(result!=null){
        
              pReadingModels.permission_model.findAll()
              .then(pResult=>{
        
              if(pResult.length > 0){
        
                pResult.forEach((data,index)=>{
        
                    staffPermission.user_id=result.user_id
                    staffPermission.permission_id= data.permision_Id
                    staffPermission.active_flag=0
        
                    pReadingModels.staff_permission_model.create(staffPermission)
                })
              }
        
              })
        
                    staff=mapper.staff(staff,result,req)
        
                    pReadingModels.staff_model.create(staff)
                    .then(staffResult=>{
        
                        if(staffResult!=null){
        
                         staffHospitalMapper = mapper.staffHospitalMapper(staffHospitalMapper,staffResult,req)
                           
                         for(var i =0 ; i<req.body.branch.length;i++){
             
                            staffHospitalMapper.hospital_branch_id=req.body.branch[i]
                            pReadingModels.hospital_staff_model.create(staffHospitalMapper)
                            .then( )
                            }
                         res.json( responseHelper.success(constant.staff_add_successfull,staffResult))
                        }
                    })
                }
            })
        })

    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.getStaffs = async (req,res,next)=>{

       var start = (req.params.start-1)*req.params.end

       var result = await  sequelize.query('SELECT * FROM vw_get_staffs '+
        ' WHERE hospital_id=:hospital_id AND hospital_branch_id=:hospital_branch_id AND deleted_flag=0 '+
        ' LIMIT ' + req.params.end +' OFFSET ' +start,
        { replacements: { 
            hospital_id:req.params.hospitalId,
            hospital_branch_id:req.params.hospitalBranchId
        }, type: sequelize.QueryTypes.SELECT }
        )
   
       if(result != null){

        var staffPermisionId =[]

        for(var i =0 ; i<result.length ; i++){
        
            var permissionResult = await sequelize.query(' SELECT user_id , permission_id  ,map_user_permissions.active_flag, permission '+
            ' FROM map_user_permissions '+
            ' JOIN m_permissions ON m_permissions.permision_Id=map_user_permissions.permission_id '+
            ' WHERE user_id=:user_id ',
            { replacements: { 
                user_id:result[i].user_id,
                deleted_flag:0
            }, type: sequelize.QueryTypes.SELECT }
            )

                if(permissionResult.length == 0){
                    result[i].dataEntry_review_permission=0
                    result[i].scoreGenerate=0
                }else{
                    for(var j = 0 ; j<permissionResult.length ;j++){
                    console.log("j :" , j)
                    result[i] = util.getStaffPermission(permissionResult[j].permission_id, result[i],permissionResult[j])
                    staffPermisionId[j]=permissionResult[j].permission_id
                    console.log("staff result :",result)
                }

                result[i].permission_id =staffPermisionId
            }    
         }
         res.json( responseHelper.success(constant.success,result))
    }else{
         res.json(responseHelper.notFound(constant.no_record_found,result))

    }
}

exports.getStaffCount=(req,res,next)=>{

    pReadingModels.hospital_staff_model
    .findAndCountAll({
       where: {
        hospital_id:req.params.hospitalId,
        hospital_branch_id:req.params.hospitalBranchId,
        deleted_flag:0 
       }   
     })
    .then(result => {
      res.json( responseHelper.success(constant.success,{staff_count:result.count}))
    });

}

exports.updateStaff=(req,res,next)=>{
    
     var staffHospitalMapper={}
     var hospitalStaffResult
     var hospitalStaff=[]

    pReadingModels.staff_model.findByPk(req.params.staffId)
    .then(result=>{
        result.first_name=req.body.firstName
        result.last_name=req.body.lastName
        result.hospital_branch_speciality_id=req.body.speciality
        result.hospital_branch_role_id=req.body.assignRole
        result.active_flag= req.body.status
        result.reporting_user_id=req.body.reportTo
        result.save()
     
        if(result!=null){
        pReadingModels.user_model.findByPk(result.user_id)
              .then(userResult=>{
                userResult.contact_number=req.body.contactNumber
                userResult.email_address=req.body.email
                userResult.user_name=req.body.username
                userResult.password=req.body.password
                userResult.save()
            })

            staffHospitalMapper = mapper.staffHospitalMapper(staffHospitalMapper,result,req)
                   
            for(var i =0 ; i<req.body.branch.length;i++){
    
               staffHospitalMapper.hospital_branch_id=req.body.branch[i]
    
               pReadingModels.hospital_staff_model.create(staffHospitalMapper)
               .then(hospitalStaffModelResult=>{
               })
            }

            pReadingModels.hospital_staff_model.findAll({
                where:{
                    hospital_id:req.params.hospitalId,
                    staff_id:req.params.staffId
                }
            }).then(hospitalStaffModelResult=>{
    
                for(var i =0 ; i<hospitalStaffModelResult.length;i++){
                    hospitalStaffModelResult[i].deleted_flag=1
                    hospitalStaffModelResult[i].active_flag=0
                    hospitalStaffModelResult[i].save()
                }
                res.json( responseHelper.success(constant.staff_updated_successfully,hospitalStaffModelResult))
            })
        }
   })

}

exports.updateStaffPermission= async (req,res)=>{

  var reqData = req.body

  for(var i =0 ; i<reqData.length ; i++ ){

    var staffDetail = reqData[i]

    var permissionId =[]
    
    var pResult = await  pReadingModels.permission_model.findAll()

        pResult.forEach((data,index)=>{
            permissionId.push(data.permision_Id)

        })

     for( var j =0 ; j<permissionId.length ; j++){

       var perId = permissionId[j]

       var staffPermission = await pReadingModels.staff_permission_model.findAll({
            where:{
               user_id:reqData[i].user_id,
               permission_id:perId
            }
         })

           console.log('staffPermission :' , staffPermission)

           if(staffPermission.length > 0){

             var result = await  pReadingModels.staff_permission_model.findByPk(staffPermission[0].user_permission_id)
               
                  console.log('user_permission_id :' , staffPermission[0].user_permission_id )

                  console.log('permission_id :' ,staffPermission[0].permission_id )

                  console.log('inside of if condition :' , result)

                   if(staffPermission[0].permission_id == 1 && staffDetail.scoreGenerate == 0  && staffDetail.dataEntry_review_permission==1)
                   {
                   result.active_flag = 1
                   }else if(staffPermission[0].permission_id == 1 && staffDetail.scoreGenerate == 0 && staffDetail.dataEntry_review_permission==0){
                   result.active_flag = 0
                   }else if (staffPermission[0].permission_id  == 2 && staffDetail.dataEntry_review_permission==0  && staffDetail.scoreGenerate == 1){
                   result.active_flag = 1
                   }else if (staffPermission[0].permission_id == 2 && staffDetail.dataEntry_review_permission == 0 && staffDetail.scoreGenerate == 0){
                   result.active_flag = 0
                   }else if(staffPermission[0].permission_id == 2 && staffDetail.dataEntry_review_permission == 1 && staffDetail.scoreGenerate == 1){
                   result.active_flag = 1
                   }else if(staffPermission[0].permission_id == 2 && staffDetail.dataEntry_review_permission == 1 && staffDetail.scoreGenerate == 0){
                   result.active_flag = 0
                   result.deleted_flag = 1
                   }else if(staffPermission[0].permission_id == 1 && staffDetail.dataEntry_review_permission == 0 && staffDetail.scoreGenerate == 1){
                   result.active_flag = 0
                   }else if(staffPermission[0].permission_id == 1 && staffDetail.dataEntry_review_permission == 1 && staffDetail.scoreGenerate == 1){
                   result.active_flag = 1
                   }
                   result.save()
           }else{
            res.json( responseHelper.notFound(constant.no_record_found))
      }      
    }
 }  

 res.json( responseHelper.success(constant.staff_updated_successfully))

}

exports.sendMail = (req,res,next) =>{
var user ={}
var referral ={}
var referralHospital ={}
user = mapper.User(user,req)

pReadingModels.user_model.findAll({
    where :{
        contact_number:req.body.contactNumber,
        email_address :req.body.email
    }
}).then(result => {
    if(result.length >0){
       res.json( responseHelper.alreadyExist(constant.user_already_exit,result))
    }
    return result
})
.then(result=>{
    pReadingModels.user_model.create(user)
    .then(result=>{
        if(result != null){
            referral = mapper.Referral(referral,req ,result)
            var result = pReadingModels.referral_doctor_model.create(referral)
            return result 
        }
    })
    .then(result=>{
        if(result != null){
            referralHospital = mapper.ReferralHospital(referralHospital,req ,result)
            var result = pReadingModels.referral_hospitals_model.create(referralHospital)
            return result
        }
    })
    .then(result=>{
    
    if(result != null){
    
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'himani.v@101bi.com',
                pass: '9669438120'
             }
         })
    
         let mailOptions = {
            from: 'himani.v@101bi.com',
            to: req.body.email, 
            subject: 'Invitation from apollo', 
            text: 'That was easy!', 
            html: '<b>Accept or reject</b>'
        }
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              res.json(responseHelper.serveError(constant.error_msg,error))
            } else {
              console.log('Email sent: ' + info.response);
              res.json( responseHelper.success(constant.success,result))
            }
          });
        }
      }) 
   })
}

exports.getReferralDoctor =(req,res,next) =>{

    var start = (req.params.start-1)*req.params.end

    sequelize.query('SELECT '+
    ' map_referral_hospitals.hospital_id , map_referral_hospitals.hospital_branch_id,map_referral_hospitals.referral_id ,map_referral_hospitals.hospital_action_status AS hospital_action_status_id , map_referral_hospitals.referral_action_status AS referral_action_status_id,map_referral_hospitals.active_flag, '+
    ' m_referral_doctors.user_id,m_referral_doctors.first_name,m_referral_doctors.last_name,m_referral_doctors.hospital_branch_speciality_id, '+
    ' m_users.address,m_users.email_address,m_users.state,m_users.city,m_users.pincode,m_users.contact_number , '+
    ' m_hospital_branch_specialities.speciality_id , '+
    ' m_specialities.speciality, '+
    ' m_status.status_name AS hospital_action_status, '+
    ' ms.status_name AS referral_action_status '+
    ' FROM map_referral_hospitals '+
    ' JOIN m_referral_doctors ON m_referral_doctors.referral_id = map_referral_hospitals.referral_id '+
    ' JOIN m_status ON m_status.status_id = map_referral_hospitals.hospital_action_status '+
    ' JOIN m_status  ms ON ms.status_id = map_referral_hospitals.referral_action_status '+
    ' JOIN m_users ON m_users.user_id = m_referral_doctors.user_id '+
    ' JOIN  m_hospital_branch_specialities ON m_hospital_branch_specialities.speciality_id=m_referral_doctors.hospital_branch_speciality_id '+
    ' JOIN  m_specialities ON m_specialities.speciality_id = m_hospital_branch_specialities.speciality_id '+
    ' WHERE map_referral_hospitals.hospital_id=:hospital_id AND map_referral_hospitals.hospital_branch_id=:hospital_branch_id '+
    ' LIMIT ' + req.params.end +' OFFSET ' +start, 
    { replacements: { 
        hospital_id:req.params.hospitalId,
        hospital_branch_id:req.params.hospitalBranchId
    }, type: sequelize.QueryTypes.SELECT }
    ).then(result => {
      res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.getReferralDoctorCount = (req,res,next) =>{

    pReadingModels.referral_hospitals_model
    .findAndCountAll({
       where: {
        hospital_id:req.params.hospitalId,
        hospital_branch_id:req.params.hospitalBranchId,
        active_flag:1 
       }   
     })
    .then(result => {
      res.json( responseHelper.success(constant.success,{referral_count:result.count}))
    });

}

exports.getStaffProfile =(req,res,next)=>{
    var branches=[]
    sequelize.query('SELECT map_staff_hospitals.hospital_id,map_staff_hospitals.hospital_branch_id,map_staff_hospitals.staff_id , '+
    ' m_staffs.first_name,m_staffs.last_name,m_staffs.staff_id,'+
    ' m_users.user_name,m_users.contact_number,m_users.email_address,' +
    ' m_specialities.speciality,m_roles.role,m_users.password,ms.user_name AS reporting_user, '+
    ' m_hospitals.hospital_name' +
    ' FROM map_staff_hospitals' +
    ' JOIN m_staffs ON m_staffs.staff_id = map_staff_hospitals.staff_id' +
    ' JOIN m_users ON m_users.user_id = m_staffs.user_id' +
    ' JOIN m_hospitals ON m_hospitals.hospital_id = map_staff_hospitals.hospital_id' +
    '  JOIN  m_hospital_branch_specialities ON m_hospital_branch_specialities.id= m_staffs.hospital_branch_speciality_id '+
    ' JOIN m_specialities ON m_specialities.speciality_id = m_hospital_branch_specialities.speciality_id '+
    ' JOIN m_hospital_branch_roles ON m_hospital_branch_roles.id = m_staffs.hospital_branch_role_id '+
    ' JOIN m_roles ON m_roles.role_id = m_hospital_branch_roles.role_id '+
    ' JOIN m_users  ms  ON ms.user_id = m_staffs.reporting_user_id ' +
    ' WHERE map_staff_hospitals.staff_id=:staff_id LIMIT 1' ,
     { replacements: { 
        staff_id:req.params.staffId,
     }, type: sequelize.QueryTypes.SELECT }
     )
     .then(result=>{
         sequelize.query('SELECT m_hospitals_branches.branch_name FROM map_staff_hospitals  JOIN  m_hospitals_branches ON m_hospitals_branches.hospital_branch_id= map_staff_hospitals.hospital_branch_id WHERE staff_id =:staff_id',
         { replacements: { 
            staff_id:req.params.staffId,
         }, type: sequelize.QueryTypes.SELECT }
         ).then(bResult =>{
            bResult.forEach((data,index)=>{
             branches.push(data.branch_name)
         })
         result[0].branches = branches
         return result
         })
         .then(result => {
            res.json( responseHelper.success(constant.success,result))
        }) 
     })
     .catch(err => {
         res.json(responseHelper.serveError(constant.error_msg,err))
      })
}

exports.updateStaffProfile =(req,res,next)=>{

 pReadingModels.staff_model.findByPk(req.params.staffId)
    .then(result=>{
        result.first_name=req.body.firstName
        result.last_name=req.body.lastName
        return result.save()
     })
     .then(result=>{
        var userResult = pReadingModels.user_model.findByPk(result.user_id)
        return userResult
     })
     .then(userResult=>{
        userResult.user_name = req.body.userName
        userResult.email_address =req.body.emailAddress
        userResult.contact_number= req.body.contactNumber
        userResult.password= req.body.password
        return userResult.save()
     })
     .then(userResult=>{
       var hospitalStaffResult = pReadingModels.hospital_staff_model.findOne({
        where:{
           staff_id:req.params.staffId
           }
        })
       return hospitalStaffResult
     })
     .then(hospitalStaffResult =>{
        var hospitalResult = pReadingModels.hospital_model.findByPk(hospitalStaffResult.hospital_id)
        return hospitalResult
     })
     .then(hospitalResult=>{
        hospitalResult.hospital_name= req.body.hospitalName
        return hospitalResult.save()
     })
     .then(result=>{
        res.json( responseHelper.success(constant.success))
     })
     .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.getReferralProfile =(req,res,next)=>{
    sequelize.query('SELECT m_referral_doctors.first_name,m_referral_doctors.last_name , '+
   // ' m_specialities.speciality, '+
    ' m_users.user_name,m_users.password,m_users.contact_number,m_users.email_address,m_users.state,m_users.city,m_users.address,m_users.pincode '+
    ' FROM m_referral_doctors '+
    ' JOIN m_users ON m_users.user_id=m_referral_doctors.user_id '+
   // ' JOIN m_hospital_branch_specialities ON m_hospital_branch_specialities.id=m_referral_doctors.hospital_branch_speciality_id '+
    //' JOIN m_specialities ON m_specialities.speciality_id=m_hospital_branch_specialities.speciality_id '+
    ' WHERE m_referral_doctors.referral_id=:referral_id',
     { replacements: { 
        referral_id:req.params.referralId,
     }, type: sequelize.QueryTypes.SELECT }
     ).then(result => {
         res.json( responseHelper.success(constant.success,result))
     })
     .catch(err => {
         res.json(responseHelper.serveError(constant.error_msg,err))
      })
}

exports.updateReferralProfile =(req,res,next)=>{
    pReadingModels.referral_doctor_model.findByPk(req.params.referralId)
    .then(result=>{
        result.first_name=req.body.firstName
        result.last_name=req.body.lastName
        return result.save()
    })
    .then(result=>{
     pReadingModels.user_model.findByPk(result.user_id)
     .then(userResult=>{
        userResult.user_name=req.body.userName
        userResult.contact_number=req.body.contactNumber
        userResult.email_address=req.body.emailAddress
        userResult.state=req.body.state
        userResult.city=req.body.city
        userResult.address=req.body.address
        userResult.pincode=req.body.pincode
        userResult.password=req.body.password
        return userResult.save()
      })
     .then(userResult=>{
         res.json( responseHelper.success(constant.success,userResult))
      })
    })
}

exports.registerReferralDoctor =(req,res,next)=>{
var user ={}
var referral ={}
user = mapper.referralUserRegister(user,req)
if(user.user_name != undefined && user.user_name.length != 0  && user.password !=undefined && user.password.length != 0 )
{
pReadingModels.user_model.findOne({
    where:{
        user_name:user.user_name,
        password:user.password
    }
})
.then(result=>{
 if(result != null){
    res.json( responseHelper.resourceAlreadyExist(constant.user_already_exist))
   }else{
 pReadingModels.user_model.create(user)
 .then(result=>{
        referral = mapper.Referral(referral,req ,result)
        pReadingModels.referral_doctor_model.create(referral)
        .then(result =>{
res.json( responseHelper.success(constant.successfully_registered,result))
 }) }) }
})
}else{
res.json( responseHelper.notFound(constant.credential_required))
}
}

exports.getReferralHospital=(req,res,next)=>{
    var start = (req.params.start-1)*req.params.end
    var hospitalIds =[]
    sequelize.query('SELECT  m_hospitals.hospital_id,m_hospitals.hospital_name,m_users.user_id , m_users.contact_number,m_users.email_address,m_users.address,m_users.city,m_users.pincode,m_users.user_name,m_users.state '+
    ' FROM m_hospitals '+
    ' JOIN m_users ON m_users.user_id = m_hospitals.user_id ' +
    ' LIMIT ' + req.params.end +' OFFSET ' +start,
     { type: sequelize.QueryTypes.SELECT }
      )
      .then(result=>{
        if(result.length > 0){
            result.forEach((data,index)=>{
                hospitalIds.push(data.hospital_id)
            })
        sequelize.query('SELECT m_status.status_name AS hospital_initiation_status ,ms.status_name AS  refferal_initiation_status,map_referral_hospitals.referral_action_status,map_referral_hospitals.hospital_id ,map_referral_hospitals.referral_hospital_id,map_referral_hospitals.referral_id , map_referral_hospitals.hospital_action_status  FROM map_referral_hospitals '+ 
        ' JOIN m_status ON m_status.status_id = map_referral_hospitals.hospital_action_status '+
        'JOIN m_status ms ON  ms.status_id = map_referral_hospitals.referral_action_status'+
        ' WHERE map_referral_hospitals.referral_id =:referral_id AND map_referral_hospitals.hospital_id '+
        'IN('+ hospitalIds+ ')',
        { replacements: { 
            referral_id:req.params.referralId,
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

                 if(result[i].hospital_id==referralHospitalResult[j].hospital_id){
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
}

exports.getReferralHospitalCount = (req,res,next) =>{
    pReadingModels.hospital_model
    .findAndCountAll()
    .then(result => {
      res.json( responseHelper.success(constant.success,{referral_hospital_count:result.count}))
    });
}

exports.updateRefferalInitiationStatus =(req,res,next) =>{
    var referralHospital={
        hospital_id:req.params.hospitalId,
        referral_id:req.params.referralId,
        requester_type:util.getRequesterType(req.body.requesterType),
        hospital_action_status:req.body.hospitalActionStatus,
        referral_action_status:req.body.referralActionStatus,
        active_flag:1,
        created_by:5,
        deleted_flag:0
    }
if(req.body.previousStatus===1){
    pReadingModels.referral_hospitals_model.create(referralHospital)
    .then(result=>{
        res.json( responseHelper.success('status updated successfully',result))
    })
}else {
    pReadingModels.referral_hospitals_model.findByPk(req.body.referralHospitalId)
     .then(result=>{
        result.hospital_action_status=req.body.hospitalActionStatus,
        result.referral_action_status=req.body.referralActionStatus
        return result.save()
      })
      .then(result =>{
        res.json( responseHelper.success('status updated successfully',result))
      })
   }
}