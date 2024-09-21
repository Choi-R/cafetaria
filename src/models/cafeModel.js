'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cafe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cafe.belongsTo(models.User, {
        foreignKey: 'managerId',
        as: 'manager'
      })

      Cafe.hasMany(models.Menu, {
        foreignKey: 'cafeId',
        as: 'menus'
      })
    }
  }
  Cafe.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        indonesianNumber(value) {
          if (!value.startsWith('+62')) {
            throw new Error('Phone number must start with "+62"');
          }
        },
        len: [6, 20],
      }
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Cafe',
    tableName: 'Cafes'
  });
  return Cafe;
};