'use strict';
module.exports = function(sequelize, DataTypes) {
  var step = sequelize.define('step', {
    timelineId: DataTypes.INTEGER,
    stepname: DataTypes.STRING,
    stepdesc: DataTypes.TEXT,
    steppos: DataTypes.INTEGER,
    //status: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.step.belongsTo(models.timeline);
      }
    }
  });
  return step;
};