'use strict';
module.exports = function(sequelize, DataTypes) {
  var Decision = sequelize.define('Decision', {
    rating: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    nextViewAt: DataTypes.DATE,
    NodeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // unique: 'compositeIndex'
    },
    NodeRating: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    UserId: {
      allowNull: false,      
      type: DataTypes.INTEGER,
      // unique: 'compositeIndex'
    },
    MoodId: {
      allowNull: false,      
      type: DataTypes.INTEGER,
      // unique: 'compositeIndex'
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Decision.belongsTo(models.Node, {foreignKey: 'NodeId', targetKey: 'id'});
        Decision.belongsTo(models.User, {foreignKey: 'UserId', targetKey: 'id'});
        // Decision.hasOne(models.Node)
      }
    }
  });
  return Decision;
};