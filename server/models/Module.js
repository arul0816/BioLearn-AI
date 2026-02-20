const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Module = sequelize.define('Module', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  topic: { type: DataTypes.STRING(255), allowNull: false },
  level: { type: DataTypes.ENUM('School', 'UG', 'PG'), allowNull: false },
  content: { type: DataTypes.TEXT('long'), allowNull: false },
  introduction: { type: DataTypes.TEXT },
  coreConcepts: { type: DataTypes.TEXT, field: 'core_concepts' },
  diagramExplanation: { type: DataTypes.TEXT, field: 'diagram_explanation' },
  realWorldApplications: { type: DataTypes.TEXT, field: 'real_world_applications' },
  summary: { type: DataTypes.TEXT },
  timeSpent: { type: DataTypes.INTEGER, defaultValue: 0, field: 'time_spent' },
  masteryScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00, field: 'mastery_score' },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_completed' }
}, {
  tableName: 'modules',
  timestamps: true
});

module.exports = Module;