const pReadingModels = require('../sequelize')
const {validationResult} = require('express-validator/check')
const responseHelper = require('../helper/res')
const constant = require('../helper/constant')
const {sequelize} = require('../sequelize')
const queries = require('../helper/queries')
const mapper = require('../mapper/mapper')
const enumConst = require('../helper/enum')

exports.registerHospitalBranch =(req,res,next)=>{
var branchUser ={}
var branch ={}
var roles ={}
branchUser = mapper.hospBranchUserMapper(branchUser,req)

pReadingModels.user_model.findAll({
    where:{
        user_name: req.body.user_name,
        password : req.body.password
    }
}).then(result => {
    if(result.length >0){
       res.json( responseHelper.alreadyExist('Branch already exit',result))
    }
    return result
}).then(result =>{
    pReadingModels.user_model.create(branchUser)
    .then(result => {
        if(!result.isEmpty){
            roles= mapper.branchRoleMapper(roles,result)
            pReadingModels.user_role_model.create(roles).then(result=>{
                if(!result.isEmpty){
                    console.log("hospital role data inserted", result)
                }
            }).catch(err=>{
                 res.json(responseHelper.serveError(constant.error_msg,err))
            })
            branch = mapper.hospBranchMapper(branch,result,req)
            pReadingModels.hospital_branch_model.create(branch)
            .then(result => {
                res.json( responseHelper.success(constant.hospital_branch_creation,result))
            }).catch(err => {
                res.json(responseHelper.serveError(constant.error_msg,err))   
            })
        }
    })
})
.catch(err => {
    res.json(responseHelper.serveError(constant.error_msg,err))
})
}

exports.getHospitalBranches=(req,res,next)=>{
    sequelize.query('SELECT * FROM  m_hospitals_branches , m_users WHERE m_hospitals_branches.user_id=m_users.user_id AND m_hospitals_branches.hospital_id=:hospitalId',
    { replacements: { 
        hospitalId:req.params.hospitalId
    }, type: sequelize.QueryTypes.SELECT }
    ).then(result => {
      res.json( responseHelper.success(constant.success,result))
    })
    .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}

exports.addRole= (req,res,next)=>{
    var roles ={}
    var hospitalBranchRole={}
    roles= mapper.hospitalBranchRoleMapper(roles,req)

    pReadingModels.role_model.findAll({
        where:{
        role:req.body.role
        }
    }).then(result => {
        if(result.length >0){
           res.json( responseHelper.alreadyExist('Role already exist',result))
        }
        return result
    }).then(result =>{
        pReadingModels.role_model.create(roles).then(result=>{
           
            if(!result.isEmpty){
    
                hospitalBranchRole.role_id=result.role_id
                hospitalBranchRole.hospital_id=req.params.hospitalId
                hospitalBranchRole.hospital_branch_id=req.params.hospitalBranchId
                hospitalBranchRole.deleted_flag=0
                hospitalBranchRole.active_flag=1
    
                pReadingModels.hospital_branch_roles_model.create(hospitalBranchRole)
                .then(result=>{
                    res.json( responseHelper.success(constant.role_add_successfully,result))
                })
            }
        })
    })
    .catch(err=>{
         res.json(responseHelper.serveError(constant.error_msg,err))
    })

}

exports.removeRole=(req,res,next)=>{
    pReadingModels.hospital_branch_roles_model.findByPk(req.params.hospitalBranchRoleId)
    .then(result=>{
        return result.destroy()
    })
    .then(result=>{
        res.json( responseHelper.success(constant.deletion_successfull,result))
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.getHopitalBranchRoles=(req,res,next)=>{
    sequelize.query('SELECT m_roles.role ,m_roles.role_id,m_hospital_branch_roles.id AS hospital_branch_role_id ,m_hospital_branch_roles.hospital_branch_id,m_hospital_branch_roles.hospital_id FROM  m_roles  JOIN  m_hospital_branch_roles ON m_roles.role_id = m_hospital_branch_roles.role_id WHERE   m_hospital_branch_roles.hospital_branch_id =:hospital_branch_id AND m_hospital_branch_roles.hospital_id=:hospital_id AND m_hospital_branch_roles.deleted_flag=0 ORDER BY m_hospital_branch_roles.createdAt DESC',
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

exports.updateHospitalBrancheRoles =(req,res,next)=>{
    var roles={}
    var hospitalBranchRole={}

    pReadingModels.hospital_branch_roles_model
    .findByPk(req.params.hospitalBranchRoleId)
    .then(result=>{
        result.deleted_flag=1
        result.save()
    })

    roles.created_by=enumConst.userType.hospital_branch,
    roles.updated_by=enumConst.userType.hospital_branch,
    roles.deleted_flag= 0,
    roles.active_flag= 1,
    roles.role=req.body.role

    pReadingModels.role_model.create(roles)
    .then(result=>{

        if(!result.isEmpty){
            hospitalBranchRole.role_id=result.role_id
            hospitalBranchRole.hospital_id=req.params.hospitalId
            hospitalBranchRole.hospital_branch_id=req.params.hospitalBranchId
            hospitalBranchRole.deleted_flag=0
            hospitalBranchRole.active_flag=1

            pReadingModels.hospital_branch_roles_model.create(hospitalBranchRole)
            .then(result=>{
                res.json( responseHelper.success(constant.role_add_successfully,result))
            })
        }
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.addSpeciality=(req,res,next)=>{
    var speciality ={}
    var hospitalBranchSpeciality={}
    speciality= mapper.hospitalBranchSpecialityMapper(speciality,req)
  pReadingModels.speciality_model.create(speciality).then(result=>{
        if(!result.isEmpty){

            hospitalBranchSpeciality.speciality_id=result.speciality_id
            hospitalBranchSpeciality.hospital_id=req.params.hospitalId
            hospitalBranchSpeciality.hospital_branch_id=req.params.hospitalBranchId
            hospitalBranchSpeciality.deleted_flag=0
            hospitalBranchSpeciality.active_flag=1

            pReadingModels.hospital_branch_speciality_model.create(hospitalBranchSpeciality)
            .then(result=>{
                res.json( responseHelper.success(constant.speciality_add_successfully,result))
            })
        }
    }).catch(err=>{
         res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.getHopitalBranchspecialities =(req,res,next)=>{
    sequelize.query('   SELECT m_specialities.speciality, m_specialities.speciality_id ,m_hospital_branch_specialities.id AS hospital_branch_speciality_id ,m_hospital_branch_specialities.hospital_id , m_hospital_branch_specialities.hospital_branch_id FROM m_specialities JOIN m_hospital_branch_specialities ON m_specialities.speciality_id =m_hospital_branch_specialities.speciality_id WHERE m_hospital_branch_specialities.hospital_id=:hospital_id AND m_hospital_branch_specialities.hospital_branch_id=:hospital_branch_id AND m_hospital_branch_specialities.deleted_flag=0 ORDER BY m_hospital_branch_specialities.createdAt DESC',
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

exports.removeSpeciality=(req,res,next)=>{
    pReadingModels.hospital_branch_speciality_model.findByPk(req.params.hospitalBranchSpecialityId)
    .then(result=>{
        return result.destroy()
    })
    .then(result=>{
        res.json( responseHelper.success(constant.deletion_successfull,result))
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateHospitalBrancheSpecialities =(req,res,next)=>{
    var speciality={}
    var hospitalBranchSpeciality={}

    pReadingModels.hospital_branch_speciality_model
    .findByPk(req.params.hospitalBranchSpecialityId)
    .then(result=>{
        result.deleted_flag=1
        result.save()
    })

    speciality.created_by=enumConst.userType.hospital_branch,
    speciality.updated_by=enumConst.userType.hospital_branch,
    speciality.deleted_flag= 0,
    speciality.active_flag= 1,
    speciality.speciality=req.body.speciality

    pReadingModels.speciality_model.create(speciality)
    .then(result=>{

        if(!result.isEmpty){
            hospitalBranchSpeciality.speciality_id=result.speciality_id
            hospitalBranchSpeciality.hospital_id=req.params.hospitalId
            hospitalBranchSpeciality.hospital_branch_id=req.params.hospitalBranchId
            hospitalBranchSpeciality.deleted_flag=0
            hospitalBranchSpeciality.active_flag=1

            pReadingModels.hospital_branch_speciality_model.create(hospitalBranchSpeciality)
            .then(result=>{
                res.json( responseHelper.success(constant.speciality_updated_successfully,result))
            })
        }
    })
    .catch(err=>{
        res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.getHopitalBranchProfile=(req,res,next)=>{
    sequelize.query('SELECT m_hospitals_branches.branch_name,m_hospitals_branches.hospital_branch_id,m_hospitals_branches.contact_person , '+
     ' m_users.user_name,m_users.contact_number,m_users.contact_number,m_users.email_address,m_users.state,m_users.city,m_users.address,m_users.pincode,m_users.password,m_hospitals.hospital_name'+
     ' FROM m_hospitals_branches '+
     ' JOIN  m_users ON m_users.user_id = m_hospitals_branches.user_id '+
     ' JOIN m_hospitals ON m_hospitals.hospital_id =  m_hospitals_branches.hospital_id '+
     ' WHERE m_hospitals_branches.hospital_branch_id =:hospital_branch_id', 
     { replacements: { 
        hospital_branch_id:req.params.hospitalBranchId,
     }, type: sequelize.QueryTypes.SELECT }
     ).then(result => {
         res.json( responseHelper.success(constant.success,result))
     })
     .catch(err => {
         res.json(responseHelper.serveError(constant.error_msg,err))
    })
}

exports.updateHopitalBranchProfile=(req,res,next)=>{
    pReadingModels.hospital_branch_model.findByPk(req.params.hospitalBranchId)
    .then(result=>{
      result.branch_name= req.body.branchName
      return result.save()
    })
    .then(result =>{
     var userResult = pReadingModels.user_model.findByPk(result.user_id)
     return userResult
    })
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
    .then(result=>{
        res.json( responseHelper.success(constant.success))
     })
     .catch(err => {
        res.json(responseHelper.serveError(constant.error_msg,err))
     })
}
