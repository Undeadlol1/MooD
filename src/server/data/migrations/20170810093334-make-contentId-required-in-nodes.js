'use strict';

var Node = require('../models').Node

module.exports = {
  up: function (queryInterface, Sequelize) {
    // destroy nodes with contentId == null, to avoid errors
    return Node.destroy({
      where: {
        $or: [
          {contentId: null},
          {contentId: false},
        ]
       }
    })
    // make actual migration
    .then(() => {
      return queryInterface.changeColumn(
        'nodes',
        'contentId',
        {
          allowNull: false,
          type: DataTypes.STRING,
          unique: 'compositeIndex',
        },
      )
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'nodes',
      'contentId',
      {
        allowNull: true,
        type: DataTypes.STRING,
        unique: 'compositeIndex',
      },
    )
  }
};
