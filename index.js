(() => {
const addButton = document.querySelector('#add-button');
const inputBox = document.querySelector('#input-box');
const ulList = document.querySelector('#ul-list');
const allCheckBox = document.querySelector('#all-checkbox');
const allDelete = document.querySelector('#delete-all');
const divButton = document.querySelector('#div-button');
const pageButtons = document.querySelector('#page-buttons');

const ENTER = 'Enter';
const ESCAPE = 'Escape';
const TASKSPERPAGE = 5;

let currentPage = 1;
let numberOfPages = 1;

let toDoList = [];

let filterType = 'button-all';

const renderToDo = () => {
  let tasks='';
  let afterTabulation = tabulationList(toDoList);
  let afterPagination = pagination(afterTabulation);
  afterPagination.forEach(task => {
    tasks += `<li class="li" data-id=${task.id}>
    <input type="checkbox" class="li-element" ${task.completed ? 'checked' : ''}></input>
    <span class="span-task">${task.name}</span>
    <input maxlength="254" value="${task.name}" class="input" hidden></input>
    <button class="delete-button">X</button>
    </li>`;
  });
  ulList.innerHTML = tasks;
  checkedCompletedAll(afterPagination);
  changeButtonText();
};

//let count1 = 0; //

const pagination = (afterTabulation) => {
  numberOfPages = Math.ceil(afterTabulation.length/TASKSPERPAGE);
  // let count2 = count1; //старая
  // count1 = toDoList.length; // новая
  // if (count1 > count2){ 
  currentPage = numberOfPages;
  //   filterType = 'button-all';
  //   tabulationList();
  // }
  let startIndex = TASKSPERPAGE * (currentPage - 1);
  let finishIndex = TASKSPERPAGE + startIndex;
  let pageCount = '';
  for (let i = 1; i <= numberOfPages; i++){
  pageCount += `<button class="page-button" data-id="${i}">${i}</button>`;
  }
  pageButtons.innerHTML = pageCount;
  return (afterTabulation.slice(startIndex, finishIndex));
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
  filterType = event.target.id;
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
  allCheckBox.checked = allChecked;
  if (toDoList.length === 0){
    allCheckBox.checked = false;
  }
};

const deleteAllCompleted = () => {
  toDoList = toDoList.filter((task) => !task.completed);
  renderToDo();
};

const allTaskCompleted = (event) => {
  toDoList.forEach(task => {
    task.completed = event.target.checked;
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

const changeSelectPage = (event) => {
  currentPage = event.target.getAttribute('data-id');
  renderToDo();
};

const selectPage = (event) => {
  if (event.target.className === 'page-button'){
    changeSelectPage(event);
  }
};

const handlerUlClick = (event) => {
  if (event.target.className === 'li-element'){
      taskCompleted(event.target.parentElement.getAttribute('data-id'));
    }
  if (event.target.className === 'delete-button'){
      taskDelete(event.target.parentElement.getAttribute('data-id'));
    }
  if (event.target.className === 'span-task' && event.detail === 2){
      updateTask(event);
    }
};

const handlerAllCheckboxClick = (event) => {
  if (event.target.className === 'all-checkbox'){
      allTaskCompleted(event);
    }
};

const handlerDeleteCompleted = (event) => {
  if (event.target.className === 'delete-all'){
      deleteAllCompleted();
    }
};

const handlerFilterType = (event) => {
  if (event.target.className  === 'div-button'){
      changeFilterType(event);
    }
};

const handlerUlKeydown = (event) => {
  if (event.key === ESCAPE){
      undoChange(event, event.target.parentElement.getAttribute('data-id'));
    }
  if (event.key === ENTER && event.target.className === 'input'){
      applyChange(event, event.target.parentElement.getAttribute('data-id'));
    }
};

const handlerAddKeydown = (event) => {
  if (event.key === ENTER && event.target.className === 'input-box'){
      addToDo();
    }
};

const handlerUpdate = (event) => {
  if (!event.target.hidden && event.target.className === 'input'){
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

pageButtons.addEventListener('click', selectPage);
inputBox.addEventListener('keydown', handlerAddKeydown);
divButton.addEventListener('click', handlerFilterType);
allDelete.addEventListener('click', handlerDeleteCompleted); 
allCheckBox.addEventListener('click', handlerAllCheckboxClick);
ulList.addEventListener('blur', handlerUpdate, true);
ulList.addEventListener('keydown', handlerUlKeydown);
ulList.addEventListener('click', handlerUlClick);
addButton.addEventListener('click', addToDo);
})();