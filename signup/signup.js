//const { response } = require("express")

const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')
const signupSubmitButton = document.querySelector('[auth-signup-submit]')
const defaultPath = '/references/todo-list-collab/javascript-finished'

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

var token;

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

clearCompleteTasksButton.addEventListener('click', e => {
    window.location.href = defaultPath + "/login.html";
  saveAndRender()
})

deleteListButton.addEventListener('click', e => {
  console.log('forget it')
})

document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault()
  //const taskName = newTaskInput.value
  //if (taskName == null || taskName === '') return
  //const task = createTask(taskName)
  //newTaskInput.value = null
  //const selectedList = lists.find(list => list.id === selectedListId)
  //selectedList.tasks.push(task)
  signup();
  saveAndRender()
})

signupSubmitButton.addEventListener('click', e => {
  e.preventDefault()
  signup();
})

function signup(){
  const entredSignupCredentials = {
    username: document.getElementById('signup-username').value,
    password: document.getElementById('signup-password').value
  };
  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify(entredSignupCredentials)
  }).then(response => response.json())
    .then(data => {      
      token = data.token;
      if(token) {
        console.log('token that you got : ',token);
        localStorage.setItem('token', token);
        window.location.href = defaultPath + "/login.html";
      }
      else {
        alert(data.message)
      }      
    })
    .catch(error => {
      console.error('Error : ', error);
    });
}

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  //clearElement(listsContainer)
  //renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    //listTitleElement.innerText = selectedList.name
    //renderTaskCount(selectedList)
    //clearElement(tasksContainer)
    //renderTasks(selectedList)
  }
}

render()