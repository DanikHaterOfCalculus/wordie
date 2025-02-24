const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correct_answer: String
});

module.exports = mongoose.model('Quiz', QuizSchema);
