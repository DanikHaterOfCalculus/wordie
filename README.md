# Wordie-Online Dictionary API

## Overview
The Online Dictionary API allows users to register, log in, search for words, add new words, take quizzes, and manage their profiles. The API is built using Node.js, Express, and MongoDB.

## Features
- User authentication (registration, login, JWT-based authentication)
- Word dictionary with multi-language support (English, Russian, Kazakh)
- Quiz functionality with random questions
- Admin panel for managing words, quizzes, and users
- Pagination support for fetching words and quizzes

## Web Interface
The Online Dictionary also provides a web interface that allows users to interact with the dictionary, take quizzes, and manage their profiles in a browser. The interface includes:
- User authentication and profile management
- Word search, filtering, and pagination
- Admin panel for managing words, quizzes, and users
- Interactive quiz section

To access the web interface, open `http://localhost:5000` in your browser after starting the server.

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- Node.js (>=14.0.0)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/online-dictionary.git
   cd online-dictionary
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Database Schema
The Online Dictionary API uses MongoDB to store data. Below are the main collections and their schemas:

### `users` Collection
Stores user information and quiz results.
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "hashed string",
  "role": "string (user | admin)",
  "quizResults": [
    {
      "quizId": "ObjectId",
      "correctAnswers": "number",
      "quizNumber": "number",
      "completionTime": "string"
    }
  ]
}
```

### `words` Collection
Stores dictionary words with translations and synonyms.
```json
{
  "_id": "ObjectId",
  "word": "string",
  "synonyms": ["string", "string"],
  "ru": "string",
  "kz": "string"
}
```

### `quizzes` Collection
Stores quiz questions with multiple-choice options.
```json
{
  "_id": "ObjectId",
  "question": "string",
  "options": ["string", "string", "string"],
  "correct_answer": "string"
}
```

## API Documentation
### Authentication Routes
#### Register User
- **Endpoint:** `POST /api/users/register`
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  { "message": "User registered successfully" }
  ```

#### Login User
- **Endpoint:** `POST /api/users/login`
- **Request Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  { "token": "your_jwt_token" }
  ```

### Word Routes
#### Get Words (Paginated)
- **Endpoint:** `GET /api/words?page=1&limit=10`
- **Response:**
  ```json
  {
    "words": [
      { "word": "hello", "ru": "здравствуйте", "kz": "сәлем" }
    ],
    "totalCount": 100
  }
  ```

#### Search Word
- **Endpoint:** `GET /api/words/search/{word}`

#### Add Word (Admin Only)
- **Endpoint:** `POST /api/words`
- **Request Body:**
  ```json
  {
    "word": "hello",
    "synonyms": ["hi", "greetings"],
    "ru": "здравствуйте",
    "kz": "сәлем"
  }
  ```

### Quiz Routes
#### Get Random Quizzes
- **Endpoint:** `GET /api/quizzes/random`
- **Response:**
  ```json
  [{ "question": "What is 2+2?", "options": ["3", "4", "5"], "correct_answer": "4" }]
  ```

#### Submit Quiz Result (Authenticated Users)
- **Endpoint:** `POST /api/users/saveQuizResult`
- **Request Body:**
  ```json
  {
    "quizId": "quiz_id",
    "correctAnswers": 8,
    "quizNumber": 3,
    "completionTime": "02/25/2025"
  }
  ```

### User Profile
#### Get Profile
- **Endpoint:** `GET /api/users/profile`

#### Update Profile
- **Endpoint:** `PUT /api/users/profile`

## Admin Features
- CRUD operations for words, quizzes, and users
- Role-based access control


