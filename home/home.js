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
const usernameTitleTop = document.getElementById('title-view-username')
const logoutButton = document.getElementById('logout-button')

const defaultPath = '/references/todo-list-collab/javascript-finished'
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
let username = localStorage.getItem("username")
let token = localStorage.getItem('token')

console.log(username);
console.log(token)
syncUserList();
usernameTitleTop.innerHTML = username;

logoutButton.addEventListener("click", e => {
  localStorage.setItem("token", "")
  localStorage.setItem("username", "")
  window.location.href = defaultPath + "/login.html";
})

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    updateTaskElementAsComplete(selectedTask)    
    save()
    renderTaskCount(selectedList)
  }
})

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  clearCompletedTaskFromDatabase(selectedListId)
  saveAndRender()
})

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  deleteListFromDatabase(selectedListId)
  selectedListId = null
  saveAndRender()
})

newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null  
  addlistTodataBase(list)
  lists.push(list)
  saveAndRender()
})

function addlistTodataBase(list){
  const listInfo = {
    id: list.id,
    name: list.name,
    username: username
  };
  fetch('http://localhost:3000/newList', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token
    }, 
    body: JSON.stringify(listInfo)
  }).then(response => response.json())
    .then(data => {      
      console.log(data)    
    })
    .catch(error => {
      console.error('Error : ', error);
      alert(error)
    });
}

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)  
  addlistElementToDatabase(task, selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

function deleteListFromDatabase(id){
  const listItemInfo = {    
    id: id,    
  };
  fetch('http://localhost:3000/deleteList', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token
    }, 
    body: JSON.stringify(listItemInfo)
  }).then(response => response.json())
    .then(data => {      
      console.log(data)
    })
    .catch(error => {
      console.error('Error : ', error);
      alert(error)
    });
}

function clearCompletedTaskFromDatabase(nid){
  const listItemInfo = {    
    nid: nid,    
  };
  fetch('http://localhost:3000/deleteCompletedFromList', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token
    }, 
    body: JSON.stringify(listItemInfo)
  }).then(response => response.json())
    .then(data => {      
      console.log(data)
    })
    .catch(error => {
      console.error('Error : ', error);
      alert(error)
    });
}

function updateTaskElementAsComplete(task){
  const listItemInfo = {
    id: task.id,
    nid: selectedListId,
    name: task.name,
    complete: task.complete
  };
  fetch('http://localhost:3000/updateTaskElement', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token
    }, 
    body: JSON.stringify(listItemInfo)
  }).then(response => response.json())
    .then(data => {      
      console.log(data)
    })
    .catch(error => {
      console.error('Error : ', error);
      alert(error)
    });
}

function addlistElementToDatabase(task, listID){
  if(listID === null) return;
  const listItemInfo = {
    id: task.id,
    nid: listID,
    name: task.name,
    complete: task.complete
  };
  fetch('http://localhost:3000/newListElement', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token
    }, 
    body: JSON.stringify(listItemInfo)
  }).then(response => response.json())
    .then(data => {      
      console.log(data)
    })
    .catch(error => {
      console.error('Error : ', error);
      alert(error)
    });
}

function syncUserList(){  
  const listFetchURL = "http://localhost:3000/lists/" + username;
  fetch(listFetchURL, {
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': token
    }, 
  }).then(response => response.json())
    .then(data => {
      lists = data;      
      //console.log(lists);
      if(lists) selectedListId = lists[0].id; 
      saveAndRender();
    })
    .catch(error => {
      console.error('Error : ', error);
      //alert(error)
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
  //console.log(JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()
  
  const selectedList = lists.find(list => list.id === selectedListId)
  console.log("selected = " + selectedList)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
    listTitleElement.innerText = "no title selected"
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}