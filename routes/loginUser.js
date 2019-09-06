import { hospital_model,user_model,hospital_branch_model,user_type_model } from '../sequelize';
import bcrypt from 'bcrypt';
import jwtSecret from '../config/jwtConfig';
import jwt from 'jsonwebtoken';
import res_help from '../helper/res';
import constant from '../helper/constant';
let Validator = require('validatorjs');
const BCRYPT_SALT_ROUNDS = constant.bcrypt_solt_text;
const enumConst = require('../helper/enum')
const {sequelize} = require('../sequelize')


module.exports = app => {
  /**
   * @method :- login
   * @requires : - for the used the default Docter login
   * @return :- Login User Response
   */
  app.post('/login', (req, res) => {
    var loginResponse ={}
    user_model.findOne({
      where: {
        user_name: req.body.username,
        password:req.body.password
      }
    })
    .then(result => {
      if(result!=null){
        loginResponse.username=result.user_name
        loginResponse.email=result.email_address
        user_type_model.findOne({
          where:{
            user_type_id:result.user_type_id
          }
        }).then(result=>{
          loginResponse.user_type=result.user_type
        })
        
        if(result.user_type_id == enumConst.userType.hospital){

          hospital_model.findOne({
            where: {
              user_id: result.user_id         
             }
          })
          .then(result=>{
            loginResponse.id=result.hospital_id
            loginResponse.hospital_name=result.hospital_name
  
            if(result!=null){
  
              hospital_branch_model.findAll({
                where: {
                  hospital_id: result.hospital_id         
                 },
                 order:[
                  ['branch_name', 'ASC']
                 ],
                 limit: 1
              }).then(result=>{
                if(result.length>0){
                  loginResponse.hospital_branch_name=result[0].branch_name
                  loginResponse.hospital_branch_id=result[0].hospital_branch_id
                  res.json( res_help.success(constant.login_success,loginResponse))
                }else{
                  loginResponse.hospital_branch_name=null
                  loginResponse.hospital_branch_id=null
                  res.json( res_help.success(constant.login_success,loginResponse))
                }
              })
            }
          })

        }else if (result.user_type_id == enumConst.userType.hospital_branch){
          
          sequelize.query('SELECT  m_hospitals_branches.hospital_branch_id,m_hospitals_branches.branch_name,m_hospitals_branches.hospital_id,m_hospitals.hospital_name '+
          ' FROM m_hospitals_branches '+
          ' JOIN m_hospitals ON m_hospitals.hospital_id = m_hospitals_branches.hospital_id '+
          ' WHERE m_hospitals_branches.user_id=:user_id',
          { replacements: { 
            user_id: result.user_id,
          }, type: sequelize.QueryTypes.SELECT })
          .then(result =>{
            loginResponse.hospital_name=result[0].hospital_name
            loginResponse.id=result[0].hospital_id
            loginResponse.hospital_branch_name=result[0].branch_name
            loginResponse.hospital_branch_id=result[0].hospital_branch_id
            loginResponse.user_type='Hospital Branch'
            return loginResponse
          })
          .then(loginResponse =>{
            res.json( res_help.success(constant.login_success,loginResponse))
          })


        }else if(result.user_type_id == enumConst.userType.hospital_staff){
         
          sequelize.query('SELECT m_staffs.staff_id,.m_staffs.first_name ,m_staffs.last_name, '+
         ' map_staff_hospitals.hospital_branch_id, map_staff_hospitals.hospital_id, '+
         ' m_hospitals.hospital_name,m_hospitals_branches.branch_name '+
         ' FROM m_staffs '+
         ' JOIN  map_staff_hospitals ON map_staff_hospitals.staff_id = m_staffs.staff_id '+
         ' JOIN m_hospitals ON m_hospitals.hospital_id = map_staff_hospitals.hospital_id '+
         ' JOIN m_hospitals_branches ON m_hospitals_branches.hospital_branch_id = map_staff_hospitals.hospital_branch_id '+
         ' WHERE m_staffs.user_id =:user_id ',
          { replacements: { 
              user_id: result.user_id,
          }, type: sequelize.QueryTypes.SELECT }
          ).then(result => {
           loginResponse.hospital_name=result[0].hospital_name
           loginResponse.id=result[0].hospital_id
           loginResponse.hospital_branch_name=result[0].branch_name
           loginResponse.hospital_branch_id=result[0].hospital_branch_id
           loginResponse.staff_id=result[0].staff_id
           loginResponse.first_name=result[0].first_name
           loginResponse.last_name=result[0].last_name
           loginResponse.user_type='Hospital Staff'
           res.json( res_help.success(constant.login_success,loginResponse))
        })
      }
      else if(result.user_type_id == enumConst.userType.referral_doctor){
        sequelize.query('SELECT m_referral_doctors.referral_id,m_referral_doctors.first_name,m_referral_doctors.last_name, '+
        ' m_users.user_id , m_users.user_type_id,m_users.user_name,m_users.contact_number,m_users.email_address,m_users.created_by '+
        ' FROM m_referral_doctors '+ 
        ' JOIN m_users ON m_users.user_id = m_referral_doctors.user_id '+
        ' WHERE m_referral_doctors.user_id =:user_id',
         { replacements: { 
             user_id: result.user_id,
         }, type: sequelize.QueryTypes.SELECT }
         ).then(result => {
          loginResponse.referral_id=result[0].referral_id
          loginResponse.first_name=result[0].first_name
          loginResponse.last_name=result[0].last_name
          loginResponse.user_id =result[0].user_id
          loginResponse.user_type_id=result[0].user_type_id
          loginResponse.user_name = result[0].user_name
          loginResponse.contact_number = result[0].contact_number
          loginResponse.email_address=result[0].email_address
          loginResponse.created_by = result[0].created_by
          loginResponse.user_type='Referral Doctor'
          res.json( res_help.success(constant.login_success,loginResponse))
       })
    }
  }else{
        res.json( res_help.notFound(constant.invalid_credential_msg,loginResponse))
      }
    })
  });

  /**
    * @method :- signup
    * @requires : - for the used the default Docter signup
    * @return :-  User Response Send
    */
  app.post('/signup', (req, res) => {
    const reqData = {
      first_name: "",
      last_name: "",
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      hospital_name: req.body.hospital_name,
      hospital_branch_name: req.body.hospital_branch_name,
      user_type: req.body.user_type,
    };

    let rules = {
      username: 'required',
      password: 'required',
      email: 'required|email'
    };
    let validation = new Validator(reqData, rules);
    if (validation.fails()) {
      res.status(200).json(res_help.notFound(constant.common_required));
    }
    isExists(hospital_model, 'username', reqData.username, (res_status, response) => {
      if (res_status) {
        res.json(res_help.success(constant.username_alreay_taken_msg, [], constant.username_alreay_taken_status));
      } else {
        isExists(hospital_model, 'email', reqData.email, (res_status, response) => {
          if (res_status) {
            res.json(res_help.success(constant.email_alreay_taken_msg, [], constant.username_alreay_taken_status));
          } else {
            bcrypt
              .hash(reqData.password, BCRYPT_SALT_ROUNDS)
              .then(function (hashedPassword) {
                reqData.password = hashedPassword;
                hospital_model.create(reqData).then((response) => {
                  res.json(res_help.success(constant.signup_success, response));
                });
              });
          }
        });
      }
    });
  });

  app.post('/forgot_password', (req, res) => {
    const whereObj = {
      email: req.body.email
    }
    hospital_model.findOne({
      where: whereObj
    })
      .then(response => {
        if (req.body.type == 1) {
          if (response) {
            res.status(200).json({ "status": true, "message": "email exist" });
          } else {
            res.status(200).json({ "status": false, "message": "email not exist, please create account first this email." });
          }
        }
        if (req.body.type == 2) {
          bcrypt
            .hash(req.body.password, BCRYPT_SALT_ROUNDS)
            .then(function (hashedPassword) {
              hospital_model.update({
                password: hashedPassword
              }, {
                  where: whereObj
                })
                .then(function (result) {
                  res.json(res_help.success(response));
                }).catch(function (err) {

                });
            });
        }
      })
      .catch(err => {
        console.log('problem communicating with db');
        res.status(500).json(err);
      });
  });
};




/**
 * 
 * @param {*} schmea 
 * @param {*} col_name 
 * @param {*} col_value 
 * @param {*} cb 
 */

let isExists = (schmea, col_name_text, col_value, cb) => {
  const whereObj = {
  }
  whereObj[col_name_text] = col_value;
  schmea.findOne({
    where: whereObj,
  })
    .then(response => {
      if (response != null) {
        cb(true, response);
      } else {
        cb(false, []);
      }
    }).catch(err => {
      cb(false, [])
    });
}



