'use strict';
module.exports = function(sequelize, DataTypes) {
  var Decision = sequelize.define('Decision', {
    rating: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    position: {
      defaultValue: 0, // TODO what about this?
      allowNull: false,// TODO and this?
      type: DataTypes.INTEGER,
    },
    viewedAmount: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    /*
      somehow even after dropping 'lastViewAt' in migration,
      Sequelize does not remove the column.
      This code is kept to avoid 'does not have default value' error
    */
    lastViewAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    },
    vote: {
      allowNull: true,
      type: DataTypes.BOOLEAN
    }
  }, {
    tableName: 'decisions',
    freezeTableName: true,
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