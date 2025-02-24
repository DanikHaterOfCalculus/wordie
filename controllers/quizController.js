const Quiz = require('../models/Quiz');

exports.getRandomQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.aggregate([{ $sample: { size: 10 } }]);
        res.json(quizzes);
    } catch (err) {
        res.status(500).send('Error fetching quizzes');
    }
};
exports.addQuiz = async (req, res) => {
    const { question, options, correct_answer } = req.body;
    try {
        const newQuiz = new Quiz({ question, options, correct_answer });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (err) {
        res.status(500).json({ message: 'Error saving quiz' });
    }
};

exports.getQuizzes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const quizzes = await Quiz.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const totalCount = await Quiz.countDocuments(); 

        res.json({ quizzes, totalCount }); 
    } catch (err) {
        console.error("Error fetching quizzes:", err);
        res.status(500).json({ message: 'Error fetching quizzes' });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });

        res.json(updatedQuiz);
    } catch (err) {
        res.status(500).json({ message: 'Error updating quiz' });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });

        res.json({ message: 'Quiz deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting quiz' });
    }
};