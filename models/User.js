const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
    quizResults: [{
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        correctAnswers: Number,
        quizNumber: Number,
        completionTime: String
    }]
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    if (this.password.startsWith('$2b$')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
