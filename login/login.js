// vars and document queries

const loginForm = document.getElementById('login-form');
const forgetPasswordButton = document.querySelector('[data-delete-list-button]')
const signUpButton = document.querySelector('[data-clear-complete-tasks-button]')
const loginSubmitButton = document.querySelector('[auth-login-submit]')

var token;

// event listners

signUpButton.addEventListener('click', e => {
    window.location.href = "../signup/signup.html";
})

forgetPasswordButton.addEventListener('click', e => {
  alert('not available yet')
})

loginForm.addEventListener('submit', e => login(e))
loginSubmitButton.addEventListener('click', e => login(e))

function login(e) {
  e.preventDefault();
  const entredLoginCredentials = {
    username: document.getElementById('login-username').value,
    password: document.getElementById('login-password').value
  };  
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify(entredLoginCredentials)
  }).then(response => response.json())
    .then(data => {      
      token = data.token;
      if(token) {
        console.log('token that you got : ',token);
        localStorage.setItem('token', token);
        localStorage.setItem('username', entredLoginCredentials.username);
        window.location.href = "../home/home.html";
      }
      else {
        alert('Invalid credentials')
      }      
    })
    .catch(error => {
      console.error('Error : ', error);
      alert("Server error")
    });
}