const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/generate', quizController.generateQuiz);
router.post('/:id/submit', quizController.submitQuiz);
router.get('/', quizController.getQuizzes);
router.get('/:id', quizController.getQuiz);

module.exports = router;