'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'vks',
      'displayName',
      {
        type: Sequelize.STRING,
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'vks',
      'displayName',
      Sequelize.STRING
    )
  }
};
