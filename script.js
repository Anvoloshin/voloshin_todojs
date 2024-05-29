(() => {
const addButton = document.querySelector('#add-task-button');
const inputBox = document.querySelector('#add-task-inputbox');
const allCheckBox = document.querySelector('#check-all-checkbox');
const ulToDo = document.querySelector('#ul');
const allDelete = document.querySelector('#delete-all-button');
const filterBlock = document.querySelector('#filter-block');
const pageNavigation = document.querySelector('#page-nav-block');

const ENTER = 'Enter';
const ESCAPE = 'Escape';
const TASKSPERPAGE = 5;

let currentPage = 1;
let toDoList = [];
let filterType = 'button-all';

const renderToDo = () => {
  let tasks='';
  const filteredToDo = tabulation(toDoList);
  const slicedTodo = pagination(filteredToDo);
  slicedTodo.forEach(task => {
    tasks += `<li class="li" data-id=${task.id}>
    <input type="checkbox" class="li-element" ${task.completed ? 'checked' : ''}></input>
    <span class="span-task">${task.name}</span>
    <input maxlength="255" value="${task.name}" class="input-update" hidden></input>
    <button class="delete-task-button">X</button>
    </li>`;
  });
  ulToDo.innerHTML = tasks;
  renderPageButton(slicedTodo);
  checkedCompletedAll(toDoList);
  changeButtonText();

  if(slicedTodo.length == 0 && currentPage > 0){
    currentPage = currentPage - 1;
    renderToDo();
  }
};

const renderPageButton = (slicedTodo) => {  
  let pageCount = '';
  for (let i = 1; i <= pageCounter(toDoList); i++){
  pageCount += `<button class="page-button" data-id="${i}">${i}</button>`;
  }
  pageNavigation.innerHTML = pageCount;

  if (slicedTodo.length > 0){
    pageNavigation.children[currentPage-1].style.background = '#8f8f8f';
    pageNavigation.children[currentPage-1].style.color = 'white';
  };
};

const pageCounter = (toDoList) => {
  let numberOfPages = 0;
  numberOfPages = Math.ceil(tabulation(toDoList).length/TASKSPERPAGE);
  return (numberOfPages);
};

const pagination = (filteredToDo) => {
  pageCounter(toDoList);
  let startIndex = TASKSPERPAGE * (currentPage - 1);
  let finishIndex = TASKSPERPAGE + startIndex;
  return (filteredToDo.slice(startIndex, finishIndex));
};

const changeButtonText = () => {
  filterBlock.firstElementChild.textContent = `All (${toDoList.length})`;
  let activeTasksLenght = toDoList.filter((task) => !task.completed);
  filterBlock.children[1].textContent = `Active (${activeTasksLenght.length})`;
  filterBlock.lastElementChild.textContent = `Completed (${toDoList.length - activeTasksLenght.length})`;
};

const tabulation = (toDoList) => {
  filterBlock.firstElementChild.style.background = '';
  filterBlock.children[1].style.background = '';
  filterBlock.lastElementChild.style.background = '';
  switch (filterType) {
    case 'button-all':
      filterBlock.firstElementChild.style.background = '#8f8f8f';
      return(toDoList);
    case 'button-active':
      filterBlock.children[1].style.background = '#8f8f8f';
      return(toDoList.filter((task) => !task.completed));
    case 'button-complited':
      filterBlock.lastElementChild.style.background = '#8f8f8f';
      return(toDoList.filter((task) => task.completed));
  }
};

const changeFilterType = (event) => {
  filterType = event.target.id;
  currentPage = pageCounter(toDoList);
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

const handlerPageSelect = (event) => {
  if (event.target.className === 'page-button'){
    changeSelectPage(event);
  }
};

const handlerUlClick = (event) => {
  if (event.target.className === 'li-element'){
      taskCompleted(event.target.parentElement.getAttribute('data-id'));
    }
  if (event.target.className === 'delete-task-button'){
      taskDelete(event.target.parentElement.getAttribute('data-id'));
    }
  if (event.target.className === 'span-task' && event.detail === 2){
      updateTask(event);
    }
};

const handlerAllCheckboxClick = (event) => {
  if (event.target.className === 'check-all-checkbox'){
      allTaskCompleted(event);
    }
};

const handlerDeleteCompleted = (event) => {
  if (event.target.className === 'delete-all-button'){
      deleteAllCompleted();
    }
};

const handlerFilterType = (event) => {
  if (event.target.className  === 'filter-button'){
      changeFilterType(event);
    }
};

const handlerUlKeydown = (event) => {
  if (event.key === ESCAPE){
      undoChange(event, event.target.parentElement.getAttribute('data-id'));
    }
  if (event.key === ENTER && event.target.className === 'input-update'){
      applyChange(event, event.target.parentElement.getAttribute('data-id'));
    }
};

const handlerAddKeydown = (event) => {
  if (event.key === ENTER && event.target.className === 'add-task-inputbox'){
      addToDo();
    }
};

const handlerUpdate = (event) => {
  if (!event.target.hidden && event.target.className === 'input-update'){
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

  filterType = 'button-all';
  currentPage = pageCounter(toDoList);
  renderToDo();
};

pageNavigation.addEventListener('click', handlerPageSelect);
inputBox.addEventListener('keydown', handlerAddKeydown);
filterBlock.addEventListener('click', handlerFilterType);
allDelete.addEventListener('click', handlerDeleteCompleted); 
allCheckBox.addEventListener('click', handlerAllCheckboxClick);
ulToDo.addEventListener('blur', handlerUpdate, true);
ulToDo.addEventListener('keydown', handlerUlKeydown);
ulToDo.addEventListener('click', handlerUlClick);
addButton.addEventListener('click', addToDo);
})();