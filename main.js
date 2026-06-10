const { animate } = anime;
const STORAGE_KEY = "kanban_tasks";
const to_dos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
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
  const last = doingContainer.lastElementChild;
  if (last) {
    animate(last, {
      scale: [0.85, 1],
      duration: 2000,
      easing: "easeOutElastic(1, .6)",
    });
  }
});
doneColumn.addEventListener("dragover", (e) => {
  e.preventDefault();
});

doneColumn.addEventListener("drop", () => {
  to_dos[draggedindex].status = "done";
  reRender();
  const last = doneContainer.lastElementChild;
  if (last) {
    animate(last, {
      scale: [0.85, 1],
      duration: 400,
      easing: "easeOutElastic(1, .6)",
    });
  }
});
todoColumn.addEventListener("dragover", (e) => {
  e.preventDefault();
});

todoColumn.addEventListener("drop", () => {
  to_dos[draggedindex].status = "todo";
  reRender();
  // Bounce effect on drop
  const last = todoContainer.lastElementChild;
  if (last) {
    animate(last, {
      scale: [0.85, 1],
      duration: 400,
      easing: "easeOutElastic(1, .6)",
    });
  }
});

const todoContainer = document.querySelector(".todo-tasks");
const doingContainer = document.querySelector(".doing-tasks");
const doneContainer = document.querySelector(".done-tasks");
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(to_dos));
}

function reRender() {
  todoContainer.innerHTML = "";
  doingContainer.innerHTML = "";
  doneContainer.innerHTML = "";
  to_dos.forEach(Createtask);
  saveTasks();
}

function showstatus(task, index, taskdiv) {
  const statusList = document.createElement("div");
  statusList.classList.add("task-more-button");

  const statuses = [
    { key: "todo", label: "TO DO" },
    { key: "doing", label: "DOING" },
    { key: "done", label: "DONE" },
  ];

  statuses.forEach(({ key, label }) => {
    const item = document.createElement("div");
    item.classList.add("task-status-item");
    item.textContent =
      task.status === key ? label + " (current)" : "Move to " + label;
    if (task.status === key) {
      item.classList.add("current");
    }
    item.addEventListener("click", () => {
      to_dos[index].status = key;
      statusList.remove();
      reRender();
    });
    statusList.appendChild(item);
  });

  taskdiv.appendChild(statusList);
}

function Createtask(task, index) {
  const taskdiv = document.createElement("div");
  taskdiv.draggable = true;
  taskdiv.addEventListener("dragstart", () => {
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
      deleteTask(index, taskdiv);
    });
    taskdiv.appendChild(deletebtn);
  }

  // More button on every task
  const morebtn = document.createElement("button");
  morebtn.innerHTML = "&#8942;";
  morebtn.classList.add("task-more-btn");
  morebtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const statuslist = taskdiv.querySelector(".task-more-button");
    if (!statuslist) {
      // Close any other open menus first
      document
        .querySelectorAll(".task-more-button")
        .forEach((el) => el.remove());
      showstatus(task, index, taskdiv);
    } else {
      statuslist.remove();
    }
  });
  taskdiv.appendChild(morebtn);

  if (task.status == "todo") {
    todoContainer.appendChild(taskdiv);
  }
  if (task.status == "doing") {
    doingContainer.appendChild(taskdiv);
  }
  if (task.status == "done") {
    doneContainer.appendChild(taskdiv);
  }

  // Animate new task appearing
  animate(taskdiv, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 400,
    easing: "easeOutCubic",
  });
}

function deleteTask(index, taskdiv) {
  // Animate task removal then delete
  animate(taskdiv, {
    opacity: [1, 0],
    scale: [1, 0.8],
    duration: 300,
    easing: "easeInCubic",
    onComplete: () => {
      to_dos.splice(index, 1);
      reRender();
    },
  });
}

// Close dropdown when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".task-more-button").forEach((el) => el.remove());
});

reRender();
const task_input = document.querySelector("#task_input");
const task_submit = document.querySelector("#task_submit");
task_submit.addEventListener("click", () => {
  const new_item = task_input.value;

  to_dos.push({ name: new_item, status: "todo" });
  task_input.value = "";
  reRender();
});
