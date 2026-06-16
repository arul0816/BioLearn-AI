/**
 * Adaptive Learning Logic for EduLearn AI
 * Determines next steps based on quiz performance
 */

const THRESHOLDS = {
  POOR: 50,      // Below 50% - needs revision
  GOOD: 80,      // 50-80% - needs more practice
  EXCELLENT: 80  // Above 80% - ready for advanced
};

/**
 * Generate adaptive recommendation based on quiz score
 * @param {number} percentage - Score percentage (0-100)
 * @param {string} topic - The topic that was tested
 * @param {string} difficulty - Current difficulty level
 * @param {string} level - Learning level (School/UG/PG)
 * @returns {object} Recommendation object
 */
const getAdaptiveRecommendation = (percentage, topic, difficulty, level) => {
  if (percentage < THRESHOLDS.POOR) {
    // Poor performance - recommend revision
    return {
      type: 'revision',
      message: `Your score of ${percentage.toFixed(1)}% indicates you need to revisit the fundamentals of ${topic}.`,
      action: 'Generate a comprehensive revision module',
      nextDifficulty: 'Easy',
      suggestedAction: 'revise_module',
      xpReward: 10,
      details: [
        'Review the core concepts module again',
        'Focus on the definitions and basic principles',
        'Try the Easy difficulty quiz before advancing',
        'Consider watching supplementary materials on this topic'
      ]
    };
  } else if (percentage < THRESHOLDS.GOOD) {
    // Moderate performance - more practice needed
    return {
      type: 'practice',
      message: `Good effort! Your score of ${percentage.toFixed(1)}% shows understanding but there\'s room to improve.`,
      action: 'Practice with medium-level questions',
      nextDifficulty: 'Medium',
      suggestedAction: 'practice_quiz',
      xpReward: 25,
      details: [
        'You have a basic understanding - keep practicing!',
        'Try Medium difficulty questions to strengthen your knowledge',
        'Review the sections you found challenging',
        'Explore real-world applications of this topic'
      ]
    };
  } else {
    // Excellent performance - unlock advanced
    const nextLevel = getNextLevel(level);
    return {
      type: 'advance',
      message: `Excellent! Your score of ${percentage.toFixed(1)}% shows mastery of ${topic}!`,
      action: nextLevel ? `Advance to ${nextLevel} level content` : 'Explore advanced specialized topics',
      nextDifficulty: 'Hard',
      suggestedAction: 'unlock_advanced',
      xpReward: 50,
      unlockedTopics: getAdvancedTopics(topic),
      details: [
        `Outstanding performance! You\'ve mastered ${topic}`,
        'You\'re ready for advanced and specialized content',
        'Try exploring related advanced topics',
        difficulty !== 'Hard' ? 'Challenge yourself with Hard difficulty questions' : 'You\'ve mastered all difficulty levels!'
      ]
    };
  }
};

/**
 * Get next educational level
 */
const getNextLevel = (currentLevel) => {
  const levels = ['School', 'UG', 'PG'];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
};

/**
 * Get related advanced topics based on current topic
 */
const getAdvancedTopics = (topic) => {
  const topicMap = {
    'math': ['Algebra Practice', 'Geometry Challenges', 'Graphing and Equations', 'Problem Solving'],
    'science': ['Physics Concepts', 'Chemistry Fundamentals', 'Biology Basics', 'Earth Science Projects'],
    'english': ['Grammar Mastery', 'Reading Comprehension', 'Writing Practice', 'Vocabulary Building'],
    'history': ['World History Themes', 'Historical Events', 'Civics & Government', 'Timeline Analysis'],
    'geography': ['Maps and Regions', 'Climate Studies', 'Human Geography', 'Landforms and Resources'],
    'computer': ['Computer Basics', 'Coding Fundamentals', 'Digital Literacy', 'Tech Projects'],
    'language': ['Language Arts', 'Essay Writing', 'Poetry Study', 'Speech & Presentation Skills']
  };
  
  const lowerTopic = topic.toLowerCase();
  for (const [key, topics] of Object.entries(topicMap)) {
    if (lowerTopic.includes(key)) {
      return topics;
    }
  }
  
  return [
    `Advanced ${topic}`,
    `${topic} Applications`,
    `${topic} in Medicine`,
    `Emerging Research in ${topic}`
  ];
};

/**
 * Calculate mastery score update
 */
const updateMasteryScore = (currentScore, newPercentage, attempts) => {
  // Weighted average: more recent scores have higher weight
  const weight = Math.min(attempts, 5) / 5;
  return (currentScore * (1 - weight) + newPercentage * weight).toFixed(2);
};

/**
 * Calculate XP reward based on performance
 */
const calculateXP = (percentage, difficulty, isFirstAttempt) => {
  const baseXP = { 'Easy': 10, 'Medium': 20, 'Hard': 35 };
  const performanceMultiplier = percentage >= 80 ? 2 : percentage >= 50 ? 1.5 : 1;
  const firstAttemptBonus = isFirstAttempt ? 1.25 : 1;
  
  return Math.round(baseXP[difficulty] * performanceMultiplier * firstAttemptBonus);
};

module.exports = {
  getAdaptiveRecommendation,
  updateMasteryScore,
  calculateXP,
  THRESHOLDS
};