// Document queries and vars

const signupForm = document.getElementById('signup-form');
const loginButton = document.querySelector('[data-clear-complete-tasks-button]')
const signupSubmitButton = document.querySelector('[auth-signup-submit]')
const forgetPasswordButton = document.querySelector('[data-delete-list-button]')

var token;

// Event Listeners

loginButton.addEventListener('click', e => {
  window.location.href = "../login/login.html";
})

forgetPasswordButton.addEventListener('click', e => {
  alert('not available yet')
})

signupForm.addEventListener('submit', e => signup(e));
signupSubmitButton.addEventListener('click', e => signup(e));

function signup(e) {
  e.preventDefault();
  const entredSignupCredentials = {
    username: document.getElementById('signup-username').value,
    password: document.getElementById('signup-password').value
  };
  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entredSignupCredentials)
  }).then(response => response.json())
    .then(data => {
      token = data.token;
      if (token) {
        console.log('token that you got : ', token);
        alert('Account Created Successfully');
        window.location.href = "../login/login.html";
      }
      else {
        alert(data.message)
      }
    })
    .catch(error => {
      alert('Server Error')
    });
}