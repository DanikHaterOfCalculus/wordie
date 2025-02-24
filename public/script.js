async function loadWords(pageNumber) {
    if (pageNumber < 1) return; 
    page = pageNumber;

    try {
        const response = await fetch(`/api/words?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.words || !Array.isArray(data.words)) {
            throw new Error("Invalid response structure: words is missing");
        }

        const wordList = document.getElementById("wordList");
        wordList.innerHTML = ""; 

        data.words.forEach(word => {
            const listItem = document.createElement("li");
            listItem.textContent = `${word.word}: Synonyms - ${word.synonyms.join(", ")}, Russian - ${word.ru}, Kazakh - ${word.kz}`;
            wordList.appendChild(listItem);
        });

        document.getElementById("currentPage").textContent = `Page: ${page}`;

        document.getElementById("prevPageButton").disabled = page === 1;
        const totalPages = Math.ceil(data.totalCount / limit);
        document.getElementById("nextPageButton").disabled = page >= totalPages;

    } catch (error) {
        console.error("Error loading words:", error);
        document.getElementById("wordList").innerHTML = `<li style="color:red;">Error loading words</li>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadWords(1);
});

document.getElementById('showAllWordsButton').addEventListener('click', () => {
    const wordListSection = document.getElementById('wordListSection');

    if (wordListSection.style.display === 'none' || wordListSection.style.display === '') {
        wordListSection.style.display = 'block';  
        document.getElementById('showAllWordsButton').textContent = 'Hide Words'; 
        loadWords(page); 
    } else {
        wordListSection.style.display = 'none';  
        document.getElementById('showAllWordsButton').textContent = 'Show All Words'; 
    }
});


async function loadWords(pageNumber) {
    if (pageNumber < 1) return;  
    page = pageNumber;  

    const response = await fetch(`/api/words?page=${page}&limit=${limit}`);
    const data = await response.json();

    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';  

    data.words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = `${word.word}: Synonyms - ${word.synonyms.join(', ')}, Russian - ${word.ru}, Kazakh - ${word.kz}`;
        wordList.appendChild(listItem);
    });

    document.getElementById('currentPage').textContent = `Page: ${page}`;

    document.getElementById('prevPageButton').disabled = (page === 1);

    const totalPages = Math.ceil(data.totalCount / limit);
    document.getElementById('nextPageButton').disabled = (page >= totalPages);
}

document.addEventListener('DOMContentLoaded', () => {
    loadWords(page);
});

document.getElementById('letterSearchButton').addEventListener('click', async () => {
    const letter = document.getElementById('letter').value;
    const response = await fetch(`/api/words/starts-with/${letter}`);
    const data = await response.json();
    
    const letterSearchResult = document.getElementById('letterSearchResult');
    letterSearchResult.innerHTML = '';

    data.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = `${word.word}: Синонимы - ${word.synonyms.join(', ')}, Русский - ${word.ru}, Казахский - ${word.kz}`;
        letterSearchResult.appendChild(listItem);
    });
});

document.getElementById('addWordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const word = document.getElementById('word').value;
    const synonyms = document.getElementById('synonyms').value;
    const ru = document.getElementById('ru').value;
    const kz = document.getElementById('kz').value;

    const response = await fetch('/api/words', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            word,
            synonyms,
            ru,
            kz,
        }),
    });

    if (response.ok) {
        fetchWords();
    } else {
        alert('Ошибка при добавлении слова');
    }
});


document.getElementById('searchButton').addEventListener('click', async () => {
    const word = document.getElementById('searchWord').value;
    const response = await fetch(`/api/words/search/${word}`);
    const data = await response.json();
    
    const searchResult = document.getElementById('searchResult');
    searchResult.innerHTML = '';

    if (data.length > 0) {
        data.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = `${word.word}: Синонимы - ${word.synonyms.join(', ')}, Русский - ${word.ru}, Казахский - ${word.kz}`;
            searchResult.appendChild(listItem);
        });
    } else {
        searchResult.textContent = 'Слово не найдено';
    }
});
let quizzes = []; 

async function fetchQuizQuestions() {
    const response = await fetch('/api/quizzes/random');
    quizzes = await response.json(); 
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = ''; 

    quizzes.forEach((quiz, index) => {

        const quizElement = document.createElement('div');
        quizElement.classList.add('quiz-question');

        const question = document.createElement('h3');
        question.textContent = `${index + 1}. ${quiz.question}`;
        quizElement.appendChild(question);

        quiz.options.forEach((option, i) => {
            const optionLabel = document.createElement('label');
            optionLabel.textContent = option;

            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question-${index}`;
            optionInput.value = option; 

            quizElement.appendChild(optionLabel);
            quizElement.appendChild(optionInput);
            quizElement.appendChild(document.createElement('br'));
        });

        quizContainer.appendChild(quizElement);
    });
}
document.getElementById('submitQuizButton').addEventListener('click', async () => {
    let score = 0;

    quizzes.forEach((quiz, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        if (selectedOption) {
            const selectedAnswer = selectedOption.value.trim(); 
            const correctAnswer = quiz.correct_answer
            console.log('Выбранный ответ:', selectedAnswer);
            console.log('Правильный ответ:', correctAnswer);
            if (selectedAnswer === correctAnswer) {
                score++;
            }
        }
    });

    const resultText = `Your score: ${score} out of ${quizzes.length}`;
    document.getElementById('quizResult').textContent = resultText;

    const token = localStorage.getItem('token');
    if (token) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;  

        try {
            const userResponse = await fetch('/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const user = await userResponse.json();
            const quizNumber = user.quizResults.length + 1; 

            const response = await fetch('/api/users/saveQuizResult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quizId: quizzes[0]._id,  
                    correctAnswers: score,  
                    quizNumber,  
                    completionTime: formattedDate  
                })
            });

            const data = await response.json();
            if (data.success) {
                console.log('Quiz result saved!');
            } else {
                console.error('Failed to save quiz result');
            }
        } catch (error) {
            console.error('Error during quiz result save:', error);
        }
    }
});

const token = localStorage.getItem('token'); 

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const profileButton = document.getElementById('profileButton');
    const logoutButton = document.getElementById('logoutButton');

    if (token) {

        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        profileButton.style.display = 'inline-block';
        logoutButton.style.display = 'inline-block';
    } else {
    
        loginButton.style.display = 'inline-block';
        registerButton.style.display = 'inline-block';
        profileButton.style.display = 'none';
        logoutButton.style.display = 'none';
    }
});


document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');  
    window.location.href = '/'; 
});

let page = 1; 
const limit = 20; 

document.addEventListener('DOMContentLoaded', fetchQuizQuestions);
document.addEventListener('DOMContentLoaded', fetchWords);