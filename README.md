# Online Dictionary API

## Overview

The Online Dictionary API allows users to register, log in, search for words, add new words, take quizzes, and manage their profiles. The API is built using Node.js, Express, and MongoDB.
Students: Rakhiya Kurbanaliyeva, Danial Turzhanov, Tamerlan Ussenov. Group SE-2331.

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

To access the web interface, open `http://localhost:3000` in your browser after starting the server.

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- Node.js (>=14.0.0)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone git clone https://github.com/DanikHaterOfCalculus/wordie.git
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

## API Endpoints

### Authentication (Public Endpoints)

- **POST** `/api/users/register` - Register a new user.
- **POST** `/api/users/login` - Authenticate users and return a JWT token.

### User Management (Private Endpoints)

- **GET** `/api/users/profile` - Retrieve the logged-in user's profile.
- **PUT** `/api/users/profile` - Update user profile.

### Word Management (Private Endpoints)

- **POST** `/api/words` - Create a new word (Admin only).
- **GET** `/api/words` - Retrieve all words.
- **GET** `/api/words/search/{word}` - Search for a word.
- **PUT** `/api/words/{id}` - Update a word (Admin only).
- **DELETE** `/api/words/{id}` - Delete a word (Admin only).

### Quiz Management (Private Endpoints)

- **POST** `/api/quizzes` - Create a new quiz (Admin only).
- **GET** `/api/quizzes` - Retrieve all quizzes.
- **GET** `/api/quizzes/random` - Retrieve random quizzes.
- **PUT** `/api/quizzes/{id}` - Update a quiz (Admin only).
- **DELETE** `/api/quizzes/{id}` - Delete a quiz (Admin only).

### Quiz Results (Private Endpoints)

- **POST** `/api/users/saveQuizResult` - Save quiz results for a logged-in user.

## Example Requests

#### Retrieve User Profile
- **GET** `/api/users/profile`
- **Response:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "quizResults": []
  }
  ```

#### Update a Word (Admin Only)
- **PUT** `/api/words/{id}`
- **Request Body:**
  ```json
  {
    "word": "updatedWord",
    "synonyms": ["syn1", "syn2"],
    "ru": "обновленный перевод",
    "kz": "жаңартылған аударма"
  }
  ```
- **Response:**
  ```json
  { "message": "Word updated successfully" }
  ```

## Admin Features

- CRUD operations for words, quizzes, and users.
- Role-based access control.
