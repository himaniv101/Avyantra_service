var table_const = require('../config/table')

module.exports =(sequelize,type)=>{
    return sequelize.define(table_const.hospital_branch_roles ,{
          id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          role_id:type.INTEGER,
          hospital_id:type.INTEGER,
          hospital_branch_id:type.INTEGER,
          deleted_flag:type.BOOLEAN,
          deleted_date:type.DATE,
          active_flag:type.BOOLEAN
    })
}



