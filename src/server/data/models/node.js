'use strict';
module.exports = function(sequelize, DataTypes) {
  var Node = sequelize.define('Node', {
      url: {
        allowNull: false,
        type: DataTypes.STRING
      },
      provider: {
        type: DataTypes.STRING,
        unique: 'compositeIndex'        
      },
      contentId: { // TODO add unique property
        type: DataTypes.STRING,
        unique: 'compositeIndex'
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
        // Deciaml points allow making of rating to be unique
        // example: rating = rating + "." + Date.now()
        type: DataTypes.DECIMAL(38, 17),
        allowNull: false,
        defaultValue: 0
      },
      type: DataTypes.STRING,
  }, {
    tableName: 'nodes',
    freezeTableName: true,    
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