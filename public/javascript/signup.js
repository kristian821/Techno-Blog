const signupFormHandler = async (event) => {
    event.preventDefault();
    
    const username = document.querySelector('#signup-username').value.trim();
    const email = document.querySelector('#signup-email').value.trim();
    const password = document.querySelector('#signup-password').value.trim();

    if (username && email && password) {
        const response = await fetch('/api/users/', {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};

const loginButtonHandler = event => {
    event.preventDefault();

    document.location.replace('/login');
};

document.querySelector('#login-btn').addEventListener('click', loginButtonHandler);
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);