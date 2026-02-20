const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Progress = sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  moduleId: { type: DataTypes.INTEGER, allowNull: true },
  quizId: { type: DataTypes.INTEGER, allowNull: true },
  topic: { type: DataTypes.STRING(255), allowNull: false },
  action: {
    type: DataTypes.ENUM('module_started', 'module_completed', 'quiz_started', 'quiz_completed', 'topic_mastered'),
    allowNull: false
  },
  score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  timeSpent: { type: DataTypes.INTEGER, defaultValue: 0, field: 'time_spent' },
  metadata: { type: DataTypes.JSON, allowNull: true }
}, {
  tableName: 'progress',
  timestamps: true,
  updatedAt: false
});

module.exports = Progress;