const login = document.querySelector('#login-page-form');
const signup = document.querySelector('#signup-page-form');

signup.hidden = true;

const signupPage = event => {
    event.preventDefault();

    login.hidden = true;    

    signup.hidden = false;
};

const loginPage = event => {
    event.preventDefault();

   signup.hidden = true;
    
    login.hidden = false;
};

const signupFormHandler = async (event) => {
    event.preventDefault();
    
    const username = document.querySelector('#signup-username').value.trim();
    const email = document.querySelector('#signup-email').value.trim();
    const password = document.querySelector('#signup-password').value.trim();
    
    if (username && email && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(response);
        if (response.ok) {
          document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};

const loginFormHandler = async (event) => {
    event.preventDefault();

    const email = document.querySelector('#login-email').value.trim();
    const password = document.querySelector('#login-password').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
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



document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('#signup-sheet-btn').addEventListener('click', signupPage);

