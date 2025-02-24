const Word = require('../models/Word');

exports.getWords = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const words = await Word.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const totalCount = await Word.countDocuments(); 

        res.json({ words, totalCount }); 
    } catch (err) {
        console.error("Error fetching words:", err);
        res.status(500).json({ message: "Error fetching words" });
    }
};


exports.getWordByQuery = async (req, res) => {
    const { word } = req.params;
    try {
        const words = await Word.find({
            $or: [
                { word: { $regex: word, $options: 'i' } },
                { ru: { $regex: word, $options: 'i' } },
                { kz: { $regex: word, $options: 'i' } }
            ]
        });
        res.json(words);
    } catch (err) {
        res.status(500).send('Error searching words');
    }
};
exports.getWordsByLetter = async (req, res) => {
    const { letter } = req.params;
    try {
        const words = await Word.find({ word: { $regex: `^${letter}`, $options: 'i' } });
        res.json(words);
    } catch (err) {
        res.status(500).send('Error fetching words starting with letter');
    }
};


exports.addWord = async (req, res) => {
    try {
        console.log("Received data:", req.body); 

        let { word, synonyms, ru, kz } = req.body;

        if (!word || !ru || !kz || !synonyms) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!Array.isArray(synonyms)) {
            synonyms = synonyms.split(',').map(s => s.trim());
        }

        const newWord = new Word({ word, synonyms, ru, kz });

        await newWord.save();
        res.status(201).json(newWord);
    } catch (err) {
        console.error('Error saving word:', err);
        res.status(500).json({ message: 'Error saving word', error: err.message });
    }
};

exports.updateWord = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedWord = await Word.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedWord) return res.status(404).json({ message: 'Word not found' });

        res.json(updatedWord);
    } catch (err) {
        res.status(500).json({ message: 'Error updating word' });
    }
};
exports.deleteWord = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWord = await Word.findByIdAndDelete(id);
        if (!deletedWord) return res.status(404).json({ message: 'Word not found' });

        res.json({ message: 'Word deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting word' });
    }
};