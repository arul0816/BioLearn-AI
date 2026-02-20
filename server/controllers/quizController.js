const openai = require('../config/openai');
const { Quiz, Question, Progress, User } = require('../models');
const { getAdaptiveRecommendation, calculateXP } = require('../utils/adaptiveLogic');

// POST /api/quizzes/generate
exports.generateQuiz = async (req, res, next) => {
  try {
    const { topic, level, difficulty = 'Medium', moduleId, questionCount = 10 } = req.body;
    const userId = req.user.id;

    if (!topic || !level) {
      return res.status(400).json({ error: 'Topic and level are required.' });
    }

    const prompt = `Generate ${questionCount} multiple choice questions (MCQs) about "${topic}" for ${level} level biotechnology students at ${difficulty} difficulty.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "questionText": "The complete question text",
    "optionA": "First option",
    "optionB": "Second option",
    "optionC": "Third option",
    "optionD": "Fourth option",
    "correctAnswer": "A",
    "explanation": "Brief explanation of why this answer is correct and why others are wrong",
    "difficulty": "${difficulty}"
  }
]

Guidelines for ${level} level ${difficulty} difficulty:
- School/Easy: Basic definitions, simple recall
- School/Medium: Understanding concepts, simple application
- UG/Easy: Conceptual understanding, terminology
- UG/Medium: Application, mechanism understanding
- UG/Hard: Analysis, problem-solving, research applications
- PG/Easy: Standard graduate concepts
- PG/Medium: Advanced mechanisms, current research
- PG/Hard: Cutting-edge research, complex analysis, experimental design

Make questions scientifically accurate and educationally valuable.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert biotechnology exam creator. Always respond with valid JSON only, no markdown.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.8
    });
    if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      return res.status(502).json({ error: 'Invalid AI response while generating quiz.' });
    }

    let questions;
    try {
      questions = JSON.parse(
        completion.choices[0].message.content
          // Strip markdown code fences (e.g. ```json ... ```) that Gemini may add
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```\s*$/, '')
          .trim()
      );
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse generated quiz questions. Please try again.' });
    }

    // Create quiz record
    const quiz = await Quiz.create({
      userId,
      moduleId: moduleId || null,
      topic,
      level,
      difficulty,
      totalQuestions: questions.length
    });

    // Create questions
    const questionRecords = await Question.bulkCreate(
      questions.map(q => ({
        quizId: quiz.id,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer.toUpperCase(),
        explanation: q.explanation,
        difficulty: q.difficulty || difficulty
      }))
    );

    // Log progress
    await Progress.create({
      userId,
      quizId: quiz.id,
      topic,
      action: 'quiz_started',
      metadata: { difficulty, level }
    });

    // Return quiz without correct answers
    const sanitizedQuestions = questionRecords.map(q => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      difficulty: q.difficulty
    }));

    res.status(201).json({
      message: 'Quiz generated successfully!',
      quiz: {
        id: quiz.id,
        topic: quiz.topic,
        level: quiz.level,
        difficulty: quiz.difficulty,
        totalQuestions: quiz.totalQuestions,
        questions: sanitizedQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/quizzes/:id/submit
exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers, timeTaken } = req.body; // answers: { questionId: 'A'|'B'|'C'|'D', ... }
    const quizId = req.params.id;
    const userId = req.user.id;

    const quiz = await Quiz.findOne({
      where: { id: quizId, userId },
      include: [{ model: Question, as: 'questions' }]
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    if (quiz.isCompleted) {
      return res.status(400).json({ error: 'Quiz already submitted.' });
    }

    // Evaluate answers
    let correctCount = 0;
    const results = [];

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer && userAnswer.toUpperCase() === question.correctAnswer;
      if (isCorrect) correctCount++;

      await question.update({
        userAnswer: userAnswer ? userAnswer.toUpperCase() : null,
        isCorrect
      });

      results.push({
        questionId: question.id,
        questionText: question.questionText,
        userAnswer: userAnswer || null,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        options: {
          A: question.optionA,
          B: question.optionB,
          C: question.optionC,
          D: question.optionD
        }
      });
    }

    const score = correctCount;
    const maxScore = quiz.totalQuestions;
    const percentage = (score / maxScore) * 100;

    // Get adaptive recommendation
    const recommendation = getAdaptiveRecommendation(percentage, quiz.topic, quiz.difficulty, quiz.level);

    // Update quiz record
    await quiz.update({
      score,
      maxScore,
      percentage,
      timeTaken: timeTaken || 0,
      isCompleted: true,
      adaptiveRecommendation: JSON.stringify(recommendation)
    });

    // Calculate and award XP
    const existingAttempts = await Quiz.count({ where: { userId, topic: quiz.topic, isCompleted: true } });
    const xpEarned = calculateXP(percentage, quiz.difficulty, existingAttempts === 1);
    await User.increment('totalXp', { by: xpEarned, where: { id: userId } });

    // Log progress
    await Progress.create({
      userId,
      quizId: quiz.id,
      topic: quiz.topic,
      action: 'quiz_completed',
      score: percentage,
      timeSpent: timeTaken || 0,
      metadata: { score, maxScore, difficulty: quiz.difficulty }
    });

    res.json({
      message: 'Quiz submitted successfully!',
      results: {
        quizId: quiz.id,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        score,
        maxScore,
        percentage: parseFloat(percentage.toFixed(2)),
        timeTaken,
        xpEarned,
        grade: percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D',
        recommendation,
        questionResults: results
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes
exports.getQuizzes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Quiz.findAndCountAll({
      where: { userId: req.user.id },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: Question, as: 'questions', attributes: ['id', 'difficulty', 'isCorrect'] }]
    });

    res.json({
      quizzes: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/:id
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Question, as: 'questions' }]
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    const quizData = quiz.toJSON();
    if (quizData.adaptiveRecommendation) {
      try { quizData.adaptiveRecommendation = JSON.parse(quizData.adaptiveRecommendation); } catch (e) { }
    }

    res.json({ quiz: quizData });
  } catch (error) {
    next(error);
  }
};