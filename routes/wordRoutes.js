const express = require('express');
const { getWords, getWordByQuery, addWord, getWordsByLetter, updateWord, deleteWord} = require('../controllers/wordController');
const { protect, admin } = require('../middlewares/auth'); 
const { validateWord } = require('../middlewares/validate');
const router = express.Router();

router.get('/', getWords);
router.get('/search/:word', getWordByQuery);
router.get('/starts-with/:letter', getWordsByLetter);

router.post('/', protect, admin, validateWord, addWord);
router.put('/:id', protect, admin, updateWord); 
router.delete('/:id', protect, admin, deleteWord); 
module.exports = router;
