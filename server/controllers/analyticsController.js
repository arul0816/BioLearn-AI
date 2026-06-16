const { User, Module, Quiz, Question, Progress } = require('../models');
const { sequelize } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const openai = require('../config/openai');

// GET /api/analytics/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Aggregate stats
    const [totalModules, completedModules, totalQuizzes, completedQuizzes] = await Promise.all([
      Module.count({ where: { userId } }),
      Module.count({ where: { userId, isCompleted: true } }),
      Quiz.count({ where: { userId } }),
      Quiz.count({ where: { userId, isCompleted: true } })
    ]);
    
    // Quiz performance stats
    const quizStats = await Quiz.findOne({
      where: { userId, isCompleted: true },
      attributes: [
        [fn('AVG', col('percentage')), 'avgScore'],
        [fn('MAX', col('percentage')), 'bestScore'],
        [fn('MIN', col('percentage')), 'worstScore'],
        [fn('SUM', col('time_taken')), 'totalTime']
      ]
    });
    
    // Recent quizzes
    const recentQuizzes = await Quiz.findAll({
      where: { userId, isCompleted: true },
      limit: 5,
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'topic', 'difficulty', 'percentage', 'score', 'maxScore', 'updatedAt']
    });
    
    // Topic mastery (aggregated from quizzes)
    const topicMastery = await Quiz.findAll({
      where: { userId, isCompleted: true },
      attributes: [
        'topic',
        [fn('AVG', col('percentage')), 'avgMastery'],
        [fn('COUNT', col('id')), 'attempts'],
        [fn('MAX', col('percentage')), 'bestScore']
      ],
      group: ['topic'],
      order: [[literal('avgMastery'), 'DESC']],
      limit: 10
    });
    
    // Performance over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const performanceOverTime = await Quiz.findAll({
      where: {
        userId,
        isCompleted: true,
        updatedAt: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: [
        [fn('DATE', col('updated_at')), 'date'],
        [fn('AVG', col('percentage')), 'avgScore'],
        [fn('COUNT', col('id')), 'quizCount']
      ],
      group: [fn('DATE', col('updated_at'))],
      order: [[literal('date'), 'ASC']]
    });
    
    // Module time spent
    const timeStats = await Module.findOne({
      where: { userId },
      attributes: [[fn('SUM', col('time_spent')), 'totalTimeSpent']]
    });
    
    const user = await User.findByPk(userId);
    
    res.json({
      overview: {
        totalModules,
        completedModules,
        totalQuizzes,
        completedQuizzes,
        moduleCompletionRate: totalModules > 0 ? ((completedModules / totalModules) * 100).toFixed(1) : 0,
        quizCompletionRate: totalQuizzes > 0 ? ((completedQuizzes / totalQuizzes) * 100).toFixed(1) : 0,
        totalXP: user.totalXp,
        streak: user.streak
      },
      quizStats: {
        avgScore: quizStats?.dataValues?.avgScore ? parseFloat(quizStats.dataValues.avgScore).toFixed(1) : 0,
        bestScore: quizStats?.dataValues?.bestScore || 0,
        worstScore: quizStats?.dataValues?.worstScore || 0,
        totalTimeMins: quizStats?.dataValues?.totalTime ? Math.round(quizStats.dataValues.totalTime / 60) : 0
      },
      totalTimeSpentMins: timeStats?.dataValues?.totalTimeSpent ? Math.round(timeStats.dataValues.totalTimeSpent / 60) : 0,
      recentQuizzes,
      topicMastery,
      performanceOverTime
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/suggestions
exports.getAISuggestions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get recent performance data
    const recentQuizzes = await Quiz.findAll({
      where: { userId, isCompleted: true },
      limit: 10,
      order: [['updatedAt', 'DESC']],
      attributes: ['topic', 'difficulty', 'percentage', 'level']
    });
    
    if (recentQuizzes.length === 0) {
      return res.json({
        suggestions: [{
          type: 'welcome',
          title: 'Get Started!',
          description: 'Generate your first learning module to begin your school learning journey.',
          priority: 'high'
        }]
      });
    }
    
    const performanceSummary = recentQuizzes.map(q =>
      `${q.topic} (${q.difficulty}): ${q.percentage?.toFixed(1)}%`
    ).join(', ');
    
    const prompt = `Based on this student's recent quiz performance across school subjects: ${performanceSummary}
    
Generate 3-4 personalized learning suggestions as a JSON array:
[
  {
    "type": "strength|weakness|recommendation|challenge",
    "title": "Short suggestion title",
    "description": "2-3 sentence actionable suggestion",
    "priority": "high|medium|low",
    "topic": "related topic if applicable"
  }
]

Be specific, actionable, and encouraging. Focus on improvement and next steps.`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a supportive AI learning coach for school learners. Respond with JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7
    });
    
    let suggestions;
    try {
      suggestions = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      suggestions = [{ type: 'recommendation', title: 'Keep Learning!', description: 'Continue practicing your school subjects and stay consistent.', priority: 'medium' }];
    }
    
    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/topics
exports.getTopicAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const topicData = await Quiz.findAll({
      where: { userId, isCompleted: true },
      attributes: [
        'topic',
        'level',
        [fn('COUNT', col('id')), 'attempts'],
        [fn('AVG', col('percentage')), 'avgScore'],
        [fn('MAX', col('percentage')), 'bestScore'],
        [fn('SUM', col('time_taken')), 'totalTime']
      ],
      group: ['topic', 'level'],
      order: [[literal('avgScore'), 'DESC']]
    });
    
    res.json({ topics: topicData });
  } catch (error) {
    next(error);
  }
};