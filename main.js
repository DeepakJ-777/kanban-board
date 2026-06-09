const to_dos = [];
let draggedindex = null;
const doingColumn = document.querySelector(".doing");
const doneColumn = document.querySelector(".done");
const todoColumn = document.querySelector(".todo");
doingColumn.addEventListener("dragover", (e) => {
  e.preventDefault();
});

doingColumn.addEventListener("drop", () => {
  to_dos[draggedindex].status = "doing";
  reRender();
});
doneColumn.addEventListener("dragover", (e) => {
  e.preventDefault();
});

doneColumn.addEventListener("drop", () => {
  to_dos[draggedindex].status = "done";
  reRender();
});
todoColumn.addEventListener("dragover", (e) => {
  e.preventDefault();
});

todoColumn.addEventListener("drop", () => {
  to_dos[draggedindex].status = "todo";
  reRender();
});

const todoContainer = document.querySelector(".todo-tasks");
const doingContainer = document.querySelector(".doing-tasks");
const doneContainer = document.querySelector(".done-tasks");
function reRender() {
  todoContainer.innerHTML = "";
  doingContainer.innerHTML = "";
  doneContainer.innerHTML = "";
  to_dos.forEach(Createtask);
}

function Createtask(task, index) {
  const taskdiv = document.createElement("div");
  taskdiv.draggable = true;
  taskdiv.addEventListener("dragstart", () => {
    console.log("drag started");
    draggedindex = index;
  });

  taskdiv.classList.add("task");
  const taskspan = document.createElement("span");
  taskspan.textContent = task.name;

  taskdiv.appendChild(taskspan);
  if (task.status == "todo") {
    const deletebtn = document.createElement("button");
    deletebtn.innerHTML = "&times;";
    deletebtn.classList.add("deletebtn");

    deletebtn.addEventListener("click", () => {
      deleteTask(index);
    });

    taskdiv.appendChild(deletebtn);
    todoContainer.appendChild(taskdiv);
  }
  if (task.status == "doing") {
    doingContainer.appendChild(taskdiv);
  }
  if (task.status == "done") {
    doneContainer.appendChild(taskdiv);
  }
}

function deleteTask(index) {
  console.log(index);
  to_dos.splice(index, 1);
  reRender();
}

reRender();
const task_input = document.querySelector("#task_input");
const task_submit = document.querySelector("#task_submit");
task_submit.addEventListener("click", () => {
  const new_item = task_input.value;

  to_dos.push({ name: new_item, status: "todo" });
  task_input.value = "";
  reRender();
});
