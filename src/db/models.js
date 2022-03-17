const { DataTypes } = require('sequelize');
const sequelize = require('./init');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  userId: { type: DataTypes.INTEGER, unique: true },
  right: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrong: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Questions = sequelize.define('questions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  messageId: { type: DataTypes.INTEGER, unique: true },
  animeTitle: { type: DataTypes.STRING, allowNull: false },
  spotifyUrl: { type: DataTypes.STRING, allowNull: false },
});
module.exports = { User, Questions };
