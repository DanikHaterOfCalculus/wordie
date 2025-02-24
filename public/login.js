const API_URL = 'https://wordie-3xo0.onrender.com'; 
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
 
    if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json(); 

        if (response.ok) {
            alert("Registration successful! Please log in.");  
            window.location.href = '/login.html';  
        } else {
            alert(data.message || 'Error during registration');
        }

    } catch (err) {
        console.error('Error during registration:', err);
        alert('Error during registration');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);  
            window.location.href = '/index.html';  
        } else {
            alert(data.message || 'Invalid login credentials');
        }

    } catch (err) {
        console.error('Error during login:', err);
        alert('Error during login');
    }
});

