'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      // define association here
      Menu.belongsTo(models.Cafe, {
        foreignKey: 'cafeId',
        as: 'cafe'
      })
    }
  }
  Menu.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    isRecommendation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cafeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cafes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};