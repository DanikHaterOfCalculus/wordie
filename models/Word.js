const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
    word: String,
    synonyms: [String],
    ru: String,
    kz: String
});

module.exports = mongoose.model('Word', WordSchema);
