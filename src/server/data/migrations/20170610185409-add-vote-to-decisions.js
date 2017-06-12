'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'decisions',
      'vote',
      {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('decisions', 'vote')
  }
};
