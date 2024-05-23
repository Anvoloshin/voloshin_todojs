const addButton = document.querySelector("#addButton")
const inputBox = document.querySelector("#inputBox")
const ulList = document.querySelector("#toDoList")
const allCheckBox = document.querySelector("#all")
const allDelete = document.querySelector("#deleteAllC")

button1 = document.querySelector("#button1")
button2 = document.querySelector("#button2")
button3 = document.querySelector("#button3")

let toDoList = [];
// let counter = 0;

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

  button1.textContent = `All (${toDoList.length})`;

  button2text = toDoList.filter((task) => task.completed == false);
  button2.textContent = `Active (${button2text.length})`

  button3.textContent = `Completed(${toDoList.length - button2text.length})`


  ulList.innerHTML = tasks;
  otherTask();
};

const taskCompleted = (id) => {
  toDoList.forEach(task => {
    if (task.id == id) {
      task.completed = !task.completed
    }
  })
  renderToDo();
}

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
}

const deleteAllComplited = () => {
  toDoList = toDoList.filter((task) => task.completed == false);
  renderToDo();
}

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
}

const taskDelete = (id) => {
  toDoList = toDoList.filter((task) => task.id != id);
  renderToDo();
}

const update = (event) => {
  event.target.setAttribute("hidden", true);
  event.target.nextElementSibling.hidden = false;
  event.target.nextElementSibling.focus();
}

const escapePress = (event, id) => {
  event.target.setAttribute("hidden", false);
  renderToDo();
}

const enterPress = (event, id) => {
  toDoList.forEach(task => {
    if (task.id == id) {
      task.name = event.target.value;
    }
  })
  event.target.setAttribute("hidden", false);
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
  if(event.target.className == 'all')
    {
      allTaskCompleted(event);
    }
  if(event.target.className == 'deleteAllC')
    {
      deleteAllComplited();
    }

  //doubleclick = click + click
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

const keydownEvent = (event) => {
  if(event.key === "Escape")
    {
      escapePress(event, event.target.id);
    }
  if(event.key === "Enter")
    {
      enterPress(event, event.target.id);
    }
}

const doublePress = (event) => {
  if(event.target.className == 'span' && event.type == "dblclick")
    {
      update(event)
    }
}

const blurEvent = (event) => {
  if(event.target.hidden == false && event.target.className == 'input')
    {
      enterPress(event, event.target.id)
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

//добавление по Enter
//пустые поля и .trim()
//tab  + enter + checkbox = on

allDelete.addEventListener("click", selectButton)
allCheckBox.addEventListener("click", selectButton)
ulList.addEventListener("blur", blurEvent, true)
ulList.addEventListener("keydown", keydownEvent)
ulList.addEventListener("dblclick", doublePress)
ulList.addEventListener("click", selectButton)
addButton.addEventListener("click", addToDo)