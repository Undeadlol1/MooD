'use strict';
module.exports = function(sequelize, DataTypes) {
  var Mood = sequelize.define('Mood', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Mood.belongsTo(models.User, { // remember the bad copypaste? 'Mood.'
          // onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
        Mood.hasMany(models.Node)
      }
    }
  });
  return Mood;
};