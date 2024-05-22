const addButton = document.querySelector("#addButton")
const inputBox = document.querySelector("#inputBox")
const ulList = document.querySelector("#toDoList")

let toDoList = [];

let counter = 0;

const renderToDo = () => {
  let tasks='';
  toDoList.forEach(task => {
    tasks += `<li>
    <input type="checkbox" class="liElement" id=${task.id} ${task.completed ? 'checked' : ''}>
    <span class="span" id=${task.id}>${task.name}</span>
    <input type="text" value=${task.name} class=input id=input-${task.id} hidden>
    <button class="deleteButton" id=${task.id}>X</button>
    </li>`;
  })
  ulList.innerHTML = tasks;
};

const taskCompleted = (id) => {
  toDoList.forEach(function (task) {
    if (task.id == id) {
      task.completed = !task.completed
    }
  })
  renderToDo();
}

const taskDelete = (id) => {
  toDoList = toDoList.filter((task) => task.id != id);
  renderToDo();
}

const update = (event, id) => {
 document.getElementById("input-"+id).hidden = false;
 document.getElementById("input-"+id).focus();
 event.target.setAttribute("hidden", true);
}

const escapePress = (event) => {
  event.target.setAttribute("hidden", false);
  renderToDo()
}

const enterPress = (event, id) => {
  console.log(id)
  console.log(task.id)
  toDoList.forEach(function (task) {
    if (task.id == id) {
      task.name = event.target.value;
      console.log("123")
    }
  })
  renderToDo();
}



const selectButton = (event) => {
  if(event.target.className == 'liElement')
    {
      taskCompleted(event.target.id);
    }
  if(event.target.className == 'deleteButton')
    {
      taskDelete(event.target.id);
    }
  if(event.target.className == 'span' && event.type == "dblclick")
    {
      update(event, event.target.id)
    }
  if(event.key === "Escape")
    {
      escapePress(event)
    }
  if(event.key === "Enter")
    {
      enterPress(event, event.target.id)
    }
  /*
  if((event.target.className == 'span' && target == event.target))
    {
      counter++;
      update(event, event.target.id)
    }
  else {
    counter = 0; 
    console.log(counter)
    target = event.target
  }  
  */
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

ulList.addEventListener("keydown", selectButton)
ulList.addEventListener("dblclick", selectButton)
ulList.addEventListener("click", selectButton)
addButton.addEventListener("click", addToDo)