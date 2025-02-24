
const Joi = require('joi');

exports.validateRegistration = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
};

exports.validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
};

exports.validateQuiz = (req, res, next) => {
    const schema = Joi.object({
        question: Joi.string().min(5).required(),
        options: Joi.array().items(Joi.string()).min(2).required(),
        correct_answer: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
};

exports.validateWord = (req, res, next) => {
    const schema = Joi.object({
        word: Joi.string().min(1).required(),
        synonyms: Joi.array().items(Joi.string()).required(),
        ru: Joi.string().required(),
        kz: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
};

exports.validateProfileUpdate = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30),
        currentPassword: Joi.string().min(6),
        newPassword: Joi.string().min(6)
    }).or('username', 'currentPassword'); 

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
};
