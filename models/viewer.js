'use strict';
module.exports = function(sequelize, DataTypes) {
  var viewer = sequelize.define('viewer', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return viewer;
};


