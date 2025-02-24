const express = require('express');
const { getRandomQuizzes } = require('../controllers/quizController');
const { protect, admin } = require('../middlewares/auth'); 
const router = express.Router();
const { getQuizzes, addQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController'); 
const { validateQuiz } = require('../middlewares/validate'); 

router.get('/', getQuizzes); 
router.get('/random', getRandomQuizzes);
router.post('/', protect, admin, validateQuiz, addQuiz);
router.put('/:id', protect, admin, updateQuiz); 
router.delete('/:id', protect, admin, deleteQuiz); 
module.exports = router;
