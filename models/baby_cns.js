var table_const = require('../config/table')
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.baby_cns, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    study_id: type.INTEGER,
    features_of_encephalopathy: type.STRING,
    seizures: type.STRING,
    abnormal_movements_like_tonic_posturing: type.STRING,
    af_bulge: type.STRING,
    patient_id: type.STRING,
    reading: type.STRING
  });
};
