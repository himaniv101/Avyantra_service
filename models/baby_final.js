var table_const = require('../config/table')
module.exports = (sequelize, type) => {
  return sequelize.define(table_const.baby_final, {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    study_id: type.INTEGER,
    days_of_stay_in_hospital: type.STRING,
    final_diagnosis_sepsis: type.STRING,
    final_diagnosis_rds: type.STRING,
    final_diagnosis_ttnb: type.STRING,
    final_diagnosis_jaundice: type.STRING,
    final_diagnosis_lbw: type.STRING,
    final_diagnosis_lga: type.STRING,
    final_diagnosis_aga: type.STRING,
    final_diagnosis_anemia: type.STRING,
    final_diagnosis_dextochordia: type.STRING,
    final_diagnosis_hypoglycemia: type.STRING,
    final_diagnosis_hypocalcemia: type.STRING,
    final_diagnosis_gastroenteritis: type.STRING,
    final_diagnosis_perinatal_respiratory_depression: type.STRING,
    final_diagnosis_shock: type.STRING,
    final_diagnosis_feeding_intolerence: type.STRING,
    final_diagnosis_thrombocytopenia: type.STRING,
    final_diagnosis_eos_los: type.STRING,
    final_diagnosis_other: type.STRING,
    final_diagnosis_pulmonary_hemerrage: type.STRING,
    final_diagnosis_sga: type.STRING,
    baby_discharge_date: type.STRING,
    reading: type.STRING
  });
};
