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
const TASKS_PER_PAGE = 5;

const SPECIAL_CHARACTERS = {
  '?' : '\u003F',
  '"' : '\u0022',
  '№' : '\u2116',
  '%' : '\u0025',
  ':' : '\u003A',
  '*' : '\u002A',
};

let currentPage = 1;
let toDoList = [];
let filterType = 'button-all';

const renderToDo = () => {
  let tasks='';
  const filteredToDo = implementTabulation(toDoList);
  const slicedTodo = implementPagination(filteredToDo);
  slicedTodo.forEach(task => {
    tasks += `<li class="li" data-id=${task.id}>
      <input type="checkbox" class="li-element" ${task.completed ? 'checked' : ''}></input>
      <span class="span-task">${task.name}</span>
      <input value="${task.name}" class="input-update" maxlength="255" hidden></input>
      <button class="delete-task-button">X</button>
    </li>`;
  });
  ulToDo.innerHTML = tasks;
  renderPageButton(slicedTodo);
  checkedCompletedAll(toDoList);
  changeButtonText();

  if(slicedTodo.length === 0 && currentPage > 0){
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
    pageNavigation.children[currentPage-1].className = 'page-button-active';
  };
};

const pageCounter = (toDoList) => Math.ceil(implementTabulation(toDoList).length/TASKS_PER_PAGE);

const implementPagination = (filteredToDo) => {
  pageCounter(toDoList);
  let startIndex = TASKS_PER_PAGE * (currentPage - 1);
  let finishIndex = TASKS_PER_PAGE + startIndex;
  return (filteredToDo.slice(startIndex, finishIndex));
};

const changeButtonText = () => {
  filterBlock.firstElementChild.textContent = `All (${toDoList.length})`;
  let activeTasksLenght = toDoList.filter((task) => !task.completed);
  filterBlock.children[1].textContent = `Active (${activeTasksLenght.length})`;
  filterBlock.lastElementChild.textContent = `Completed (${toDoList.length - activeTasksLenght.length})`;
};

const carryOutValidation = (val) => {
  return (_.escape(val.value.replace(/\s+/g, ' ')
    .replace(/[?"№%:*]/g, (symbolFromString) => SPECIAL_CHARACTERS[symbolFromString]).trim()))
};

const implementTabulation = (toDoList) => {
  for (let i = 0; i <= 2; i++){
     filterBlock.children[i].classList.remove('filter-button-active')
  }
  switch (filterType) {
    case 'button-all':
      filterBlock.firstElementChild.classList.add('filter-button-active');
      return(toDoList);
    case 'button-active':
      filterBlock.children[1].classList.add('filter-button-active');
      return(toDoList.filter((task) => !task.completed));
    case 'button-complited':
      filterBlock.lastElementChild.classList.add('filter-button-active');
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
  if (filterType != 'button-all'){
    currentPage = pageCounter(toDoList);
  }
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
      event.target.value = carryOutValidation(event.target)
      if (event.target.value != ''){
        task.name = event.target.value;
      };
      }
    })
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

const addToDo = (event) => {
  inputBox.value = carryOutValidation(inputBox)
  if (inputBox.value != ''){
    const task = {
      id: Date.now(),
      name: inputBox.value,
      completed: false,
    };
    toDoList.push(task);
    filterType = 'button-all';
  }
  inputBox.value='';
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