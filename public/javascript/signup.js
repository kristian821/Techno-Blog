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
          document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
};

document.querySelector('#signup-btn').addEventListener('submit', signupFormHandler);

