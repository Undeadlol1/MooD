'use strict';
module.exports = function(sequelize, DataTypes) {
  var Node = sequelize.define('Node', {
      url: {
        allowNull: false,
        type: DataTypes.STRING
      },
      contentId: {
        type: DataTypes.STRING,
        // allowNull: false
      },
      UserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      MoodId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      provider: DataTypes.STRING,
      type: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // Node.belongsTo(models.User, { // remember the bad copypaste? 'Mood.'
        //   // onDelete: "CASCADE",
        //   foreignKey: {
        //     allowNull: false
        //   }
        // });
        // Node.belongsTo(models.Mood, { // remember the bad copypaste? 'Mood.'
        //   // onDelete: "CASCADE",
        //   foreignKey: {
        //     allowNull: false
        //   }
        // });
        Node.belongsTo(models.Mood, {foreignKey: 'MoodId', targetKey: 'id'});
        Node.hasOne(models.Decision)
      }
    }
  });
  return Node;
};