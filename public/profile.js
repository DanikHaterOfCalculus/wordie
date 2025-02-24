const API_URL = window.API_URL || 'https://wordie-3xo0.onrender.com';
const token = localStorage.getItem('token'); 
document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token'); 
    if (!token) {
        window.location.href = '/login.html';  
        return;
    }

    try {
        const response = await fetch('${API_URL}/api/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const userData = await response.json();
        displayProfile(userData);
        if (userData.role === 'admin') {
            document.getElementById('adminPanel').style.display = 'block';
            loadUsers();
            loadWords();
            loadQuizzes();
        }
    } catch (err) {
        console.error('Error fetching user data:', err);
        alert('Error fetching profile data. Please check the console for details.');
    }
});

function displayProfile(data) {
    document.getElementById('username').textContent = `Username: ${data.username}`;
    document.getElementById('email').textContent = `Email: ${data.email}`;

    const quizResults = document.getElementById('quizResults');
    data.quizResults.forEach(result => {
        const listItem = document.createElement('li');
        listItem.textContent = `Quiz #${result.quizNumber}: Correct Answers: ${result.correctAnswers}, Completed At: ${result.completionTime}`;
        quizResults.appendChild(listItem);
    });
}
async function loadUsers() {
    try {
        const response = await fetch('${API_URL}/api/users/all-users', { 
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("Users API response:", data);  

        if (!Array.isArray(data)) throw new Error('Invalid response format');

        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        data.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.username} - ${user.email} (${user.role})`;
            userList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

let wordPage = 1;
const wordLimit = 20;

async function loadWords(pageNumber = 1) {
    if (pageNumber < 1) return;
    wordPage = pageNumber;

    try {
        const response = await fetch(`${API_URL}/api/words?page=${wordPage}&limit=${wordLimit}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("Words API response:", data);  

        if (!data.words || !Array.isArray(data.words)) {
            throw new Error('Invalid response format: Missing `words` array');
        }

        const wordList = document.getElementById('wordList');

        if (!wordList) {
            console.error("Error: 'wordList' element not found in DOM.");
            return;
        }

        wordList.innerHTML = '';  

        data.words.forEach(word => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${word.word}</strong> - ${word.ru}, ${word.kz}
                <br> <em>Synonyms:</em> ${word.synonyms && word.synonyms.length ? word.synonyms.join(', ') : 'None'}
                <br>
                <button onclick="editWord('${word._id}', '${word.word}', '${word.ru}', '${word.kz}')">Edit</button>
                <button onclick="deleteWord('${word._id}')">Delete</button>`;
            wordList.appendChild(listItem);
        });

        const totalPages = data.totalCount ? Math.ceil(data.totalCount / wordLimit) : 1;
        wordPage = Math.min(wordPage, totalPages);

        document.getElementById('currentPage').textContent = `Page: ${wordPage}`;
        document.getElementById('prevPageButton').disabled = (wordPage === 1);
        document.getElementById('nextPageButton').disabled = (wordPage >= totalPages);
    } catch (error) {
        console.error('Error loading words:', error);
        document.getElementById('wordList').innerHTML = '<li style="color:red;">Error loading words</li>';
    }
}

document.getElementById('prevPageButton').addEventListener('click', () => loadWords(wordPage - 1));
document.getElementById('nextPageButton').addEventListener('click', () => loadWords(wordPage + 1));

document.addEventListener('DOMContentLoaded', () => {
    loadWords(1); 
    const wordListSection = document.getElementById('wordListSection');
    if (wordListSection) {
        wordListSection.style.display = 'block';
    }
});

function editWord(id, word, ru, kz) {
    const newWord = prompt("Edit Word:", word);
    const newRu = prompt("Edit Russian Translation:", ru);
    const newKz = prompt("Edit Kazakh Translation:", kz);

    if (!newWord || !newRu || !newKz) return;

    fetch(`${API_URL}/api/words/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word: newWord, ru: newRu, kz: newKz })
    }).then(response => {
        if (response.ok) {
            alert("Word updated successfully!");
            loadWords(wordPage);
        } else {
            alert("Error updating word.");
        }
    }).catch(error => console.error('Error updating word:', error));
}
function deleteWord(id) {
    if (!confirm("Are you sure you want to delete this word?")) return;

    fetch(`${API_URL}/api/words/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(response => {
        if (response.ok) {
            alert("Word deleted successfully!");
            loadWords(wordPage);
        } else {
            alert("Error deleting word.");
        }
    }).catch(error => console.error('Error deleting word:', error));
}
function editQuiz(id, question, correctAnswer) {
    const newQuestion = prompt("Edit Question:", question);
    const newCorrectAnswer = prompt("Edit Correct Answer:", correctAnswer);

    if (!newQuestion || !newCorrectAnswer) return;

    fetch(`${API_URL}/api/quizzes/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: newQuestion, correct_answer: newCorrectAnswer })
    }).then(response => {
        if (response.ok) {
            alert("Quiz updated successfully!");
            loadQuizzes(quizPage);
        } else {
            alert("Error updating quiz.");
        }
    }).catch(error => console.error('Error updating quiz:', error));
}
function deleteQuiz(id) {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    fetch(`${API_URL}/api/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(response => {
        if (response.ok) {
            alert("Quiz deleted successfully!");
            loadQuizzes(quizPage);
        } else {
            alert("Error deleting quiz.");
        }
    }).catch(error => console.error('Error deleting quiz:', error));
}

let quizPage = 1;
const quizLimit = 10;

async function loadQuizzes(pageNumber = 1) {
    if (pageNumber < 1) return;
    quizPage = pageNumber;

    try {
        const response = await fetch(`${API_URL}/api/quizzes?page=${quizPage}&limit=10`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Quizzes API response:", data);

        if (!data.quizzes || !Array.isArray(data.quizzes)) throw new Error('Invalid response format');

        const quizList = document.getElementById('quizList');
        quizList.innerHTML = '';

        data.quizzes.forEach(quiz => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>Q:</strong> ${quiz.question} <br>
                                  <strong>Correct Answer:</strong> ${quiz.correct_answer}
                <button onclick="editQuiz('${quiz._id}', '${quiz.question}', '${quiz.correct_answer}')">Edit</button>
                <button onclick="deleteQuiz('${quiz._id}')">Delete</button>`;
            quizList.appendChild(listItem);
        });
        

        const totalPages = data.totalCount ? Math.ceil(data.totalCount / quizLimit) : 1;
        quizPage = Math.min(quizPage, totalPages);

        document.getElementById('quizPage').textContent = `Page: ${quizPage}`;
        document.getElementById('prevQuizPage').disabled = (quizPage === 1);
        document.getElementById('nextQuizPage').disabled = (quizPage >= totalPages);
    } catch (error) {
        console.error('Error loading quizzes:', error);
    }
}

document.getElementById('prevQuizPage').addEventListener('click', () => loadQuizzes(quizPage - 1));
document.getElementById('nextQuizPage').addEventListener('click', () => loadQuizzes(quizPage + 1));

document.addEventListener('DOMContentLoaded', () => loadQuizzes(1));




document.getElementById('addWordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const word = document.getElementById('word').value.trim();
    const synonyms = document.getElementById('synonyms').value.trim();
    const ru = document.getElementById('ru').value.trim();
    const kz = document.getElementById('kz').value.trim();

    if (!word || !ru || !kz || !synonyms) {
        alert("Please fill in all fields.");
        return;
    }

    const synonymsArray = synonyms.split(',').map(s => s.trim());

    try {
        console.log("Sending data:", { word, synonyms: synonymsArray, ru, kz }); 

        const response = await fetch('/api/words', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word, synonyms: synonymsArray, ru, kz })
        });

        if (!response.ok) throw new Error('Failed to add word');

        alert('Word added successfully!');
        document.getElementById('addWordForm').reset(); 
        loadWords(); 
    } catch (error) {
        console.error('Error adding word:', error);
        alert('Error adding word.');
    }
});





document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login.html';  
});
document.getElementById('returnHomeButton').addEventListener('click', () => {
    window.location.href = '/';  
});
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');  

    if (!token) {
        window.location.href = '/login.html';  
        return;
    }

    try {
        const userResponse = await fetch('/api/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const user = await userResponse.json();
        const quizResults = user.quizResults;  

        const labels = quizResults.map(result => `Quiz ${result.quizNumber}`);
        const data = quizResults.map(result => result.correctAnswers);

        drawQuizResultsChart(labels, data);

    } catch (error) {
        console.error('Error fetching quiz results:', error);
        alert('Error fetching quiz results');
    }
});

function drawQuizResultsChart(labels, data) {
    const ctx = document.getElementById('quizResultsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',  
        data: {
            labels: labels,  
            datasets: [{
                label: 'Correct Answers',
                data: data,  
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Quiz Number'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Correct Answers'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('updateUsernameForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newUsername = document.getElementById('newUsername').value.trim();
    if (!newUsername) {
        alert("Please enter a new username.");
        return;
    }

    try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: newUsername })
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.message === "Username already exists") {
                alert("This username is already taken. Please choose a different one.");
            } else {
                alert(`Error updating username: ${data.message}`);
            }
            return;
        }

        alert('Username updated successfully!');
        window.location.reload(); 
    } catch (error) {
        console.error('Error updating username:', error);
        alert('An unexpected error occurred. Please try again.');
    }
});

document.getElementById('updatePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (!currentPassword || !newPassword) {
        alert("Please enter both your current and new password.");
        return;
    }

    try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await response.json(); 

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update password'); 
        }

        alert('Password updated successfully!');
        document.getElementById('updatePasswordForm').reset(); 
    } catch (error) {
        console.error('Error updating password:', error);
        alert(error.message); 
    }
});
