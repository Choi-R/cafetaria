'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [managers] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role='manager';`
    );

    await queryInterface.bulkInsert('Cafes', [
      {
        name: 'Cafe Example',
        address: '123 Example St',
        phoneNumber: '+6281234567890',
        managerId: managers[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cafes', null, {});
  },
};
