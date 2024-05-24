const addButton = document.querySelector("#addButton");
const inputBox = document.querySelector("#inputBox");
const ulList = document.querySelector("#toDoList");
const allCheckBox = document.querySelector("#allCheckBox");
const allDelete = document.querySelector("#deleteAll");
const divButton = document.querySelector("#divButton");

const buttonAll = document.querySelector("#buttonAll");
const buttonActive = document.querySelector("#buttonActive");
const buttonComplited = document.querySelector("#buttonComplited");

let toDoList = [];

const renderToDo = () => {
  let tasks='';
  toDoList.forEach(task => {
    tasks += `<li>
    <input type="checkbox" class="liElement" id=${task.id} ${task.completed ? 'checked' : ''}>
    <span class="span" id=${task.id}>${task.name}</span>
    <input value=${task.name} class="input" id=${task.id} hidden>
    <button class="deleteButton" id=${task.id}>X</button>
    </li>`;
  })
  ulList.innerHTML = tasks;
  otherTask();
  changeButtonText();
};

const changeButtonText = () => {
  buttonAll.textContent = `All (${toDoList.length})`;
  activeLenght = toDoList.filter((task) => task.completed == false);
  buttonActive.textContent = `Active (${activeLenght.length})`
  buttonComplited.textContent = `Completed(${toDoList.length - activeLenght.length})`
};

const tabulationList = () => {
  // empty
};

const taskCompleted = (id) => {
  toDoList.forEach(task => {
    if (task.id == id) {
      task.completed = !task.completed
    }
  })
  renderToDo();
};

const otherTask = () => {
  toDoList.forEach(task => {  
    if (task.completed != allCheckBox.checked) 
      {
      allCheckBox.checked = false;
      }
    })
  if(toDoList.every(toDoList =>{return toDoList.completed == true}))
    {
      allCheckBox.checked = true;
    }
  if(toDoList.length == 0){
    allCheckBox.checked = false;
  }
};

const deleteAllComplited = () => {
  toDoList = toDoList.filter((task) => task.completed == false);
  renderToDo();
};

const allTaskCompleted = (event) => {
  if(event.target.checked == false)
    {
      toDoList.forEach(task => {
        task.completed=false;
      })
    }
  else if(event.target.checked == true)
    {
      toDoList.forEach(task => {
        task.completed=true;
      })
    }
  renderToDo();
};

const taskDelete = (id) => {
  toDoList = toDoList.filter((task) => task.id != id);
  renderToDo();
};

const update = (event) => {
  event.target.setAttribute("hidden", true);
  event.target.nextElementSibling.hidden = false;
  event.target.nextElementSibling.focus();
};

const escapePress = (event, id) => {
  event.target.setAttribute("hidden", false);
  renderToDo();
};

const enterPress = (event, id) => {
  toDoList.forEach(task => {
    if (task.id == id) {
      task.name = event.target.value;
    }
  })
  event.target.setAttribute("hidden", false);
  renderToDo();
};

const selectButton = (event) => {
  if(event.target.className == 'liElement')
    {
      taskCompleted(event.target.id);
    }
  if(event.target.className == 'deleteButton')
    {
      taskDelete(event.target.id);
    }
  if(event.target.className == 'allCheckBox')
    {
      allTaskCompleted(event);
    }
  if(event.target.className == 'deleteAll')
    {
      deleteAllComplited();
    }
  if(event.target.className  == 'divButton')
    {
      tabulationList();
    }
  if(event.target.className == 'span' && event.detail == 2)
    {
      update(event);
    }
};

const keydownEvent = (event) => {
  if(event.key === "Escape")
    {
      escapePress(event, event.target.id);
    }
  if(event.key === "Enter" && event.target.className == 'input')
    {
      enterPress(event, event.target.id);
    }
  if(event.key === "Enter" && event.target.className == 'inputBox')
    {
      addToDo();
    }
};

const doublePress = (event) => {
  if(event.target.className == 'span' && event.type == "dblclick")
    {
      update(event)
    }
};

const blurEvent = (event) => {
  if(event.target.hidden == false && event.target.className == 'input')
    {
      enterPress(event, event.target.id)
    }
};

const addToDo = () => {
  const task = {
    id: Date.now(),
    name: inputBox.value,
    completed: false 
  }
  toDoList.push(task);
  inputBox.value="";
  renderToDo();
  addButton.blur();
  inputBox.blur();
};

inputBox.addEventListener("keydown", keydownEvent);
//divButton.addEventListener("click", selectButton); // for tabutationList
allDelete.addEventListener("click", selectButton);
allCheckBox.addEventListener("click", selectButton);
ulList.addEventListener("blur", blurEvent, true);
ulList.addEventListener("keydown", keydownEvent);
ulList.addEventListener("click", selectButton);
addButton.addEventListener("click", addToDo);