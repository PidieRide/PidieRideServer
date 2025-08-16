'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Orders', 'latitude', {
  type: Sequelize.DECIMAL(10, 8),
  allowNull: true
});
await queryInterface.addColumn('Orders', 'longitude', {
  type: Sequelize.DECIMAL(11, 8),
  allowNull: true
});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Orders', 'latitude');
    await queryInterface.removeColumn('Orders', 'longitude');
  }
};
