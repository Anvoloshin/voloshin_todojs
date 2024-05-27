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

let filterType = "buttonAll";

const renderToDo = () => {
  let tasks='';
  tabulationList(toDoList).forEach(task => {
    tasks += `<li class="li">
    <input type="checkbox" class="liElement" id=${task.id} ${task.completed ? 'checked' : ''}>
    <span class="span" id=${task.id}>${task.name}</span>
    <input value="${task.name}" class="input" id=${task.id} hidden>
    <button class="deleteButton" id=${task.id}>X</button>
    </li>`;
  })
  ulList.innerHTML = tasks;
  otherTask(tabulationList(toDoList));
  changeButtonText();
};

const changeButtonText = () => {
  buttonAll.textContent = `All (${toDoList.length})`;
  let activeLenght = toDoList.filter((task) => task.completed == false);
  buttonActive.textContent = `Active (${activeLenght.length})`
  buttonComplited.textContent = `Completed(${toDoList.length - activeLenght.length})`
};

const tabulationList = (toDoList) => {
  switch (filterType) {
    case "buttonAll":
      return(toDoList);
    case "buttonActive":
      return(toDoList.filter((task) => task.completed == false))
    case "buttonComplited":
      return(toDoList.filter((task) => task.completed == true));
  }
};

const changeButton = (event) => {
  buttonAll.style.background = "";
  buttonActive.style.background = "";
  buttonComplited.style.background = "";

  switch (event.target.id) {
    case "buttonAll": 
      filterType = event.target.id;
      event.target.style.background = "#8f8f8f";
      break;
    case "buttonActive": 
      filterType = event.target.id;
      event.target.style.background = "#8f8f8f";
      break;
    case "buttonComplited": 
      filterType = event.target.id;
      event.target.style.background = "#8f8f8f";
      break;
  }
  renderToDo();
}

const taskCompleted = (id) => {
  toDoList.forEach(task => {
    if (task.id == id) {
      task.completed = !task.completed
    }
  })
  renderToDo();
};

const otherTask = (toDoList) => {
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

const escapePress = (event) => {
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
      changeButton(event);
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
};

inputBox.addEventListener("keydown", keydownEvent);
divButton.addEventListener("click", selectButton);
allDelete.addEventListener("click", selectButton);
allCheckBox.addEventListener("click", selectButton);
ulList.addEventListener("blur", blurEvent, true);
ulList.addEventListener("keydown", keydownEvent);
ulList.addEventListener("click", selectButton);
addButton.addEventListener("click", addToDo);