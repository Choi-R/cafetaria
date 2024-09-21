'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [cafes] = await queryInterface.sequelize.query(
      `SELECT id FROM "Cafes";`
    );

    await queryInterface.bulkInsert('Menus', [
      {
        name: 'Espresso',
        price: 17900,
        isRecommendation: true,
        cafeId: cafes[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Latte',
        price: 19900,
        isRecommendation: false,
        cafeId: cafes[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Menus', null, {});
  },
};
