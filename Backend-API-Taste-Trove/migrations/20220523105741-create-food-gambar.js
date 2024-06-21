"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("food_gambar", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      FoodId: {
        type: Sequelize.INTEGER,
        references: {
          model: "food",
          key: "id",
        },
      },
      gambar: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("food_gambar");
  },
};
