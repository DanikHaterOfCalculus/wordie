const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        next(err);
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('quizResults.quizId');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            username: user.username,
            email: user.email,
            role: user.role, 
            quizResults: user.quizResults
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

exports.saveQuizResult = async (req, res) => {
    const { quizId, correctAnswers, quizNumber, completionTime } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.quizResults.push({ quizId, correctAnswers, quizNumber, completionTime });
        await user.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Error saving quiz result' });
    }
};
const bcrypt = require('bcrypt');

exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { username, currentPassword, newPassword } = req.body;

        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== req.user.id) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            user.username = username;
        }

        if (currentPassword && newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters long' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }


            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await User.findOneAndUpdate(
                { _id: req.user.id },
                { password: hashedPassword },
                { new: true }
            );

            return res.json({ message: 'Profile updated successfully' });
        }

        await user.save();
        res.json({ message: 'Profile updated successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
};
