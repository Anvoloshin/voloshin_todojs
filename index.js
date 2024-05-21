const addButton = document.querySelector("#addButton")
const inputBox = document.querySelector("#inputBox")
const list = document.querySelector("#toDoList")

let toDoList = []

const renderToDo = () => {

    console.log(toDoList)
    let listElement='';
    toDoList.forEach(task => {
    listElement += `<li>
      <input type="checkbox" class="liEl" id=${task.id} ${task.completed ? 'checked' : ''}>
      <span class="span" id=${task.id}>${task.name}<span>
      <button class="deleteButton" id=${task.id}>X</button>
    </li>`;
    })
    list.innerHTML = listElement;
};

const taskCompleted = (id) => {
    toDoList.forEach(function (task) {
        if (task.id == id) {
            task.completed = !task.completed
        }
    })
}

const taskDelete = (id) => {
    toDoList = toDoList.filter((task) => task.id != id);
    renderToDo();
}

const update = (event) => {
    if(event.target.className == 'span')
        {
          console.log("Изменение")
        }
}

const buttonSelect = (event) => {
    if(event.target.className == 'liEl')
      {
        taskCompleted(event.target.id)
      }
    if(event.target.className == 'deleteButton')
      {
        taskDelete(event.target.id)
      }
}

const addToDo = () => {
    const task = {
      id: Date.now(),
      name: inputBox.value,
      completed: false 
    }
    toDoList.push(task);
    inputBox.value=""

    renderToDo();
};

list.addEventListener("dblclick", update)
list.addEventListener("click", buttonSelect)
addButton.addEventListener("click", addToDo)