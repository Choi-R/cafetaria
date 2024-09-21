'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        username: 'superadmin',
        fullname: 'Super Admin',
        password: hashedPassword,
        role: 'superadmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'owner',
        fullname: 'Cafe Owner',
        password: hashedPassword,
        role: 'owner',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'manager',
        fullname: 'Cafe Manager',
        password: hashedPassword,
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user',
        fullname: 'Regular User',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
