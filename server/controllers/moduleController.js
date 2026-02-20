const openai = require('../config/openai');
const { Module, Progress } = require('../models');
const { Op } = require('sequelize');

// POST /api/modules/generate
exports.generateModule = async (req, res, next) => {
  try {
    const { topic, level } = req.body;
    const userId = req.user.id;

    if (!topic || !level) {
      return res.status(400).json({ error: 'Topic and level are required.' });
    }

    const prompt = `You are an expert biotechnology professor. Create a comprehensive, structured learning module on "${topic}" for ${level} level students.

Format your response as a valid JSON object with this exact structure:
{
  "introduction": "A clear 2-3 paragraph introduction to the topic, its importance in biotechnology, and what students will learn. Include historical context.",
  "coreConcepts": [
    {
      "title": "Concept title",
      "explanation": "Detailed explanation of the concept",
      "keyTerms": ["term1", "term2", "term3"]
    }
  ],
  "diagramExplanation": "Describe 2-3 important diagrams or visual representations that explain this topic, including what each element represents and how they interact",
  "realWorldApplications": [
    {
      "field": "Application field (e.g., Medicine, Agriculture, Industry)",
      "application": "Description of the real-world application",
      "example": "A specific real-world example"
    }
  ],
  "summary": "A concise summary of all key points covered in this module in 3-4 sentences",
  "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3", "takeaway4", "takeaway5"],
  "furtherReading": ["resource1", "resource2", "resource3"]
}

Tailor the complexity and depth to ${level} students:
- School: Simple language, basic concepts, relatable analogies
- UG: Moderate depth, molecular mechanisms, standard terminology  
- PG: Advanced concepts, current research, technical details, recent breakthroughs

Topic: ${topic}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert biotechnology professor who creates educational content. Always respond with valid JSON only, no markdown.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.7
    });

    if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      throw new Error('Invalid AI response: missing completion content');
    }

    let content;
    try {
      const rawContent = completion.choices[0].message.content
        // Strip markdown code fences (e.g. ```json ... ```) that Gemini may add
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/, '')
        .trim();
      content = JSON.parse(rawContent);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      content = {
        introduction: completion.choices[0].message.content,
        coreConcepts: [],
        diagramExplanation: '',
        realWorldApplications: [],
        summary: '',
        keyTakeaways: [],
        furtherReading: []
      };
    }

    // Save module to database
    const module = await Module.create({
      userId,
      topic,
      level,
      content: JSON.stringify(content),
      introduction: content.introduction,
      coreConcepts: JSON.stringify(content.coreConcepts),
      diagramExplanation: content.diagramExplanation,
      realWorldApplications: JSON.stringify(content.realWorldApplications),
      summary: content.summary
    });

    // Log progress
    await Progress.create({
      userId,
      moduleId: module.id,
      topic,
      action: 'module_started',
      metadata: { level }
    });

    res.status(201).json({
      message: 'Learning module generated successfully!',
      module: {
        ...module.toJSON(),
        contentParsed: content
      }
    });
  } catch (error) {
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'AI service temporarily unavailable. Please try again later.' });
    }
    next(error);
  }
};

// GET /api/modules
exports.getModules = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, topic, level } = req.query;
    const offset = (page - 1) * limit;
    const where = { userId: req.user.id };

    if (topic) where.topic = { [Op.like]: `%${topic}%` };
    if (level) where.level = level;

    const { count, rows } = await Module.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      modules: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/modules/:id
exports.getModule = async (req, res, next) => {
  try {
    const module = await Module.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found.' });
    }

    // Parse JSON fields for response
    const moduleData = module.toJSON();
    try {
      moduleData.coreConcepts = JSON.parse(module.coreConcepts || '[]');
      moduleData.realWorldApplications = JSON.parse(module.realWorldApplications || '[]');
      moduleData.contentParsed = JSON.parse(module.content || '{}');
    } catch (e) { }

    res.json({ module: moduleData });
  } catch (error) {
    next(error);
  }
};

// PUT /api/modules/:id/complete
exports.completeModule = async (req, res, next) => {
  try {
    const { timeSpent } = req.body;
    const module = await Module.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found.' });
    }

    await module.update({ isCompleted: true, timeSpent: timeSpent || 0 });

    await Progress.create({
      userId: req.user.id,
      moduleId: module.id,
      topic: module.topic,
      action: 'module_completed',
      timeSpent: timeSpent || 0
    });

    res.json({ message: 'Module marked as completed!', module });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/modules/:id
exports.deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found.' });
    }

    await module.destroy();
    res.json({ message: 'Module deleted successfully.' });
  } catch (error) {
    next(error);
  }
};