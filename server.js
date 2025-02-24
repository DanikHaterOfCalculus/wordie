require('dotenv').config(); 
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const wordRoutes = require('./routes/wordRoutes');
const quizRoutes = require('./routes/quizRoutes');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const port = process.env.PORT || 5000

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/quizzes', quizRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
