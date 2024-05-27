(() => {
const addButton = document.querySelector('#add-button');
const inputBox = document.querySelector('#input-box');
const ulList = document.querySelector('#ul-list');
const allCheckBox = document.querySelector('#all-checkbox');
const allDelete = document.querySelector('#delete-all');
const divButton = document.querySelector('#div-button');

let toDoList = [];

let filterType = 'button-all';

const renderToDo = () => {
  let tasks='';
  let afterTabulation = tabulationList(toDoList);
  afterTabulation.forEach(task => {
    tasks += `<li class="li" data-id=${task.id}>
    <input type="checkbox" class="li-element" ${task.completed ? 'checked' : ''}></input>
    <span class="span-task">${task.name}</span>
    <input maxlength="255" value="${task.name}" class="input" hidden></input>
    <button class="delete-button">X</button>
    </li>`;
  });
  ulList.innerHTML = tasks;
  checkedCompletedAll(afterTabulation);
  changeButtonText();
};

const changeButtonText = () => {
  divButton.firstElementChild.textContent = `All (${toDoList.length})`;
  let activeTasksLenght = toDoList.filter((task) => !task.completed);
  divButton.children[1].textContent = `Active (${activeTasksLenght.length})`;
  divButton.lastElementChild.textContent = `Completed(${toDoList.length - activeTasksLenght.length})`;
};

const tabulationList = (toDoList) => {
  divButton.firstElementChild.style.background = '';
  divButton.children[1].style.background = '';
  divButton.lastElementChild.style.background = '';

  switch (filterType) {
    case 'button-all':
      divButton.firstElementChild.style.background = '#8f8f8f';
      return(toDoList);
    case 'button-active':
      divButton.children[1].style.background = '#8f8f8f';
      return(toDoList.filter((task) => !task.completed));
    case 'button-complited':
      divButton.lastElementChild.style.background = '#8f8f8f';
      return(toDoList.filter((task) => task.completed));
  }
};

const changeFilterType = (event) => {
  switch (filterType = event.target.id) {
    case 'button-all': 
      filterType = event.target.id;
      break;
    case 'button-active': 
      filterType = event.target.id;
      break;
    case 'button-complited': 
      filterType = event.target.id;
      break;
  }
  renderToDo();
};

const taskCompleted = (id) => {
  toDoList.forEach(task => {
    if (task.id === Number(id)) {
      task.completed = !task.completed;
    }
  });
  renderToDo();
};

const checkedCompletedAll = (toDoList) => {
  let allChecked = toDoList.every(toDoList => toDoList.completed);
  allCheckBox.checked = allChecked ? true : false;

  if(toDoList.length === 0){
    allCheckBox.checked = false;
  }
};

const deleteAllCompleted = () => {
  toDoList = toDoList.filter((task) => !task.completed);
  renderToDo();
};

const allTaskCompleted = (event) => {
  toDoList.forEach(task => {
    task.completed = event.target.checked ? true : false;
  });
  renderToDo();
};

const taskDelete = (id) => {
  toDoList = toDoList.filter((task) => task.id != id);
  renderToDo();
};

const updateTask = (event) => {
  event.target.setAttribute('hidden', true);
  event.target.nextElementSibling.hidden = false;
  event.target.nextElementSibling.focus();
};

const undoChange = (event) => {
  event.target.setAttribute('hidden', false);
  renderToDo();
};

const applyChange = (event, id) => {
  toDoList.forEach(task => {
    if (task.id === Number(id)) {
      task.name = event.target.value;
    }
  });
  event.target.setAttribute('hidden', false);
  renderToDo();
};

const handlerUlClick = (event) => {
  if(event.target.className === 'li-element')
    {
      taskCompleted(event.target.parentElement.getAttribute('data-id'));
    }
  if(event.target.className === 'delete-button')
    {
      taskDelete(event.target.parentElement.getAttribute('data-id'));
    }
  if(event.target.className === 'span-task' && event.detail === 2)
    {
      updateTask(event);
    }
};

const handlerAllCheckboxClick = (event) => {
  if(event.target.className === 'all-checkbox')
    {
      allTaskCompleted(event);
    }
};

const handlerDeleteCompleted = (event) => {
  if(event.target.className === 'delete-all')
    {
      deleteAllCompleted();
    }
};

const handlerFilterType = (event) => {
  if(event.target.className  === 'div-button')
    {
      changeFilterType(event);
    }
};

const handlerUlKeydown = (event) => {
  if(event.key === 'Escape')
    {
      undoChange(event, event.target.parentElement.getAttribute('data-id'));
    }
  if(event.key === 'Enter' && event.target.className === 'input')
    {
      applyChange(event, event.target.parentElement.getAttribute('data-id'));
    }
};

const handlerAddKeydown = (event) => {
  if(event.key === 'Enter' && event.target.className === 'input-box')
    {
      addToDo();
    }
};

const handlerUpdate = (event) => {
  if(!event.target.hidden && event.target.className === 'input')
    {
      applyChange(event, event.target.parentElement.getAttribute('data-id'));
    }
};

const addToDo = () => {
  const task = {
    id: Date.now(),
    name: inputBox.value,
    completed: false,
  };
  toDoList.push(task);
  inputBox.value='';
  renderToDo();
};

inputBox.addEventListener('keydown', handlerAddKeydown);
divButton.addEventListener('click', handlerFilterType);
allDelete.addEventListener('click', handlerDeleteCompleted); 
allCheckBox.addEventListener('click', handlerAllCheckboxClick);
ulList.addEventListener('blur', handlerUpdate, true);
ulList.addEventListener('keydown', handlerUlKeydown);
ulList.addEventListener('click', handlerUlClick);
addButton.addEventListener('click', addToDo);
})();