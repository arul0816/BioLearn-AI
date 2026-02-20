const { sequelize } = require('../config/db');
const User = require('./User');
const Module = require('./Module');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Progress = require('./Progress');

// Associations
// User -> Many Modules
User.hasMany(Module, { foreignKey: 'userId', as: 'modules', onDelete: 'CASCADE' });
Module.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> Many Quizzes
User.hasMany(Quiz, { foreignKey: 'userId', as: 'quizzes', onDelete: 'CASCADE' });
Quiz.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Module -> Many Quizzes
Module.hasMany(Quiz, { foreignKey: 'moduleId', as: 'quizzes', onDelete: 'SET NULL' });
Quiz.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

// Quiz -> Many Questions
Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

// User -> Many Progress records
User.hasMany(Progress, { foreignKey: 'userId', as: 'progress', onDelete: 'CASCADE' });
Progress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Module -> Many Progress records
Module.hasMany(Progress, { foreignKey: 'moduleId', as: 'progress', onDelete: 'SET NULL' });
Progress.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

// Quiz -> Many Progress records
Quiz.hasMany(Progress, { foreignKey: 'quizId', as: 'progress', onDelete: 'SET NULL' });
Progress.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

module.exports = { sequelize, User, Module, Quiz, Question, Progress };