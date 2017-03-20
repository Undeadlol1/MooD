'use strict';
module.exports = function(sequelize, DataTypes) {
  var Decision = sequelize.define('Decision', {
    rating: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    nextViewAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    NodeId: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Decision.belongsTo(models.Node, {foreignKey: 'NodeId', targetKey: 'id'});
        Decision.belongsTo(models.User, {foreignKey: 'UserId', targetKey: 'id'});
      }
    }
  });
  return Decision;
};