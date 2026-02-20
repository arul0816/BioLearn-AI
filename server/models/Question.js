const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quizId: { type: DataTypes.INTEGER, allowNull: false, field: 'quiz_id' },
  questionText: { type: DataTypes.TEXT, allowNull: false, field: 'question_text' },
  optionA: { type: DataTypes.STRING(500), allowNull: false, field: 'option_a' },
  optionB: { type: DataTypes.STRING(500), allowNull: false, field: 'option_b' },
  optionC: { type: DataTypes.STRING(500), allowNull: false, field: 'option_c' },
  optionD: { type: DataTypes.STRING(500), allowNull: false, field: 'option_d' },
  correctAnswer: { type: DataTypes.ENUM('A', 'B', 'C', 'D'), allowNull: false, field: 'correct_answer' },
  userAnswer: { type: DataTypes.ENUM('A', 'B', 'C', 'D'), allowNull: true, field: 'user_answer' },
  explanation: { type: DataTypes.TEXT, allowNull: true },
  difficulty: { type: DataTypes.ENUM('Easy', 'Medium', 'Hard'), defaultValue: 'Medium' },
  isCorrect: { type: DataTypes.BOOLEAN, allowNull: true, field: 'is_correct' },
  points: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
  tableName: 'questions',
  timestamps: true,
  updatedAt: false
});

module.exports = Question;