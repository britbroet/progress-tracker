'use strict';
module.exports = function(sequelize, DataTypes) {
  var timeline = sequelize.define('timeline', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.timeline.belongsTo(models.user);
        models.timeline.hasMany(models.step);
      }
    }
  });
  return timeline;
};