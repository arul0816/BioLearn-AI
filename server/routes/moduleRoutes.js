const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/generate', moduleController.generateModule);
router.get('/', moduleController.getModules);
router.get('/:id', moduleController.getModule);
router.put('/:id/complete', moduleController.completeModule);
router.delete('/:id', moduleController.deleteModule);

module.exports = router;