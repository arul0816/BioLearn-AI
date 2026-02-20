const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Quiz = sequelize.define('Quiz', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  moduleId: { type: DataTypes.INTEGER, allowNull: true },
  topic: { type: DataTypes.STRING(255), allowNull: false },
  level: { type: DataTypes.ENUM('School', 'UG', 'PG'), allowNull: false },
  difficulty: { type: DataTypes.ENUM('Easy', 'Medium', 'Hard'), defaultValue: 'Medium' },
  totalQuestions: { type: DataTypes.INTEGER, defaultValue: 0, field: 'total_questions' },
  score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  maxScore: { type: DataTypes.DECIMAL(5, 2), allowNull: true, field: 'max_score' },
  percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  timeTaken: { type: DataTypes.INTEGER, allowNull: true, field: 'time_taken' },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_completed' },
  adaptiveRecommendation: { type: DataTypes.TEXT, allowNull: true, field: 'adaptive_recommendation' }
}, {
  tableName: 'quizzes',
  timestamps: true
});

module.exports = Quiz;