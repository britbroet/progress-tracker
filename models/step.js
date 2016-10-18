'use strict';
module.exports = function(sequelize, DataTypes) {
  var step = sequelize.define('step', {
    timelineId: DataTypes.INTEGER,
    stepname: DataTypes.STRING,
    stepdesc: DataTypes.TEXT,
    steppos: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return step;
};