'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Partners', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true
    });
    await queryInterface.addColumn('Partners', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Partners', 'latitude');
    await queryInterface.removeColumn('Partners', 'longitude');
  }
};
