'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.changeColumn(
      'decisions',
      'NodeId',
      {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    )
    queryInterface.addColumn(
      'decisions',
      'UserId',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.changeColumn(
      'decisions',
      'NodeId',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: 'true'
      }
    )
    queryInterface.removeColumn('decisions', 'UserId')
  }
};
