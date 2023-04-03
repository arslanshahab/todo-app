// task model
// {
//   id: number,
//   title: string,
//   isCompleted: boolean,
//   createdAt: DateTime
// }

const tasksList = [];

let isEditable = false;
let activeId = -1;
let taskId = 0;
let subscribeInterval;
let subscribeTimeOut;

const userInput = document.getElementById("user-input");
const selectAll = document.getElementById("select-all");
const filtersDropdown = document.getElementById("filters-dropdown");
const list = document.querySelector(".tasks-list");

const keyPressListener = (event) => {
  if (event.key === "Enter") {
    // add task
    const { value } = document.getElementById("user-input");

    // if (!value) {
    if (value === "") {
      alert("Please enter some text.");
      return;
    }

    const task = tasksList.find((t) => t.title === value);

    if (task) {
      alert("This item already exists.");
      return;
    }

    // relatively better approach | alternate condition

    // if (isValid(value)) {
    //   alert("Please enter some text.");
    //   return;
    // }

    if (!isEditable) {
      addTask(value);
    } else {
      updateText(value);
    }
  }
};

// adding an event listener
document.addEventListener("keypress", keyPressListener);

const addTask = (taskText) => {
  // create an object for the new task
  // id: ++tasksList[tasksList.length - 1].id,
  const obj = {
    id: ++taskId,
    title: taskText,
    isCompleted: false,
    createdAt: new Date().toLocaleDateString(),
  };
  // push to tasklist array
  tasksList.push(obj);

  setTaskItemUI(obj);

  resetInputField();
};

// prepare the code for editing the task
const updateTask = (id) => {
  const currentTask = tasksList.find((t) => t.id === id);

  userInput.value = currentTask.title;
  isEditable = true;
  activeId = id;
};

// values modification in terms of UI
const updateText = (taskText) => {
  const currentTask = tasksList.find((t) => t.id === activeId);

  currentTask.title = taskText;

  const activeSpan = document.querySelector(`#item_${activeId} span`);

  activeSpan.innerText = taskText;

  isEditable = false;

  resetInputField();
};

const resetInputField = () => {
  // clearInputField
  userInput.value = "";
};

// mark as complete functionality

const markAsComplete = (id) => {
  const currentTask = tasksList.find((t) => t.id === id);

  // const currentState = currentTask.isCompleted
  currentTask.isCompleted = !currentTask.isCompleted;

  // 1.get desired list item

  const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);
  const currentTaskItem = document.querySelector(`#item_${id}`);

  activeCheckbox.classList.toggle("checkbox-filled");
  currentTaskItem.classList.toggle("completed");
};

const markItemAsComplete = (id) => {
  const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);
  const currentTaskItem = document.querySelector(`#item_${id}`);

  activeCheckbox.classList.add("checkbox-filled");
  currentTaskItem.classList.add("completed");
};

const markItemAsInComplete = (id) => {
  const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);
  const currentTaskItem = document.querySelector(`#item_${id}`);

  activeCheckbox.classList.remove("checkbox-filled");
  currentTaskItem.classList.remove("completed");
};

const deleteTask = (id) => {
  const isAllowed = confirm("Are you sure you want to delete this task?");

  if (!isAllowed) {
    return;
  }

  const index = tasksList.findIndex((t) => t.id === id);

  tasksList.splice(index, 1);

  const currentTaskItem = document.querySelector(`#item_${id}`);
  currentTaskItem.remove();
};

// const isValid = (value) => {
//   // if (value === "" && task) {
//   //   return false;
//   // }
//   // return true

//   // return value === ""
// };

const showSubscribeModal = () => {
  // const handler = () => {
  //   alert("Subscribe to our News Letter");
  // };
  console.log("first line");

  subscribeTimeOut = setTimeout(() => {
    alert("Subscribe to our News Letter");
    // console.log("Subscribe to our News Letter")
  }, 5000); // time in milliseconds

  console.log("third line");
  console.log("fourth line");

  subscribeInterval = setInterval(() => {
    // alert("Subscribe to our News Letter");
    console.log("Subscribe to our News Letter", new Date().getTime());
  }, 1000);
};

const resetInterval = () => {
  console.log("stopped...");
  clearInterval(subscribeInterval);
  clearTimeout(subscribeTimeOut);
};

// showSubscribeModal();

const handleSelectAllChange = (event) => {
  const { checked } = event.target;

  tasksList.forEach((t) => {
    t.isCompleted = checked;
    const activeCheckbox = document.querySelector(`#item_${t.id} .checkbox`);
    const currentTaskItem = document.querySelector(`#item_${t.id}`);

    checked
      ? activeCheckbox.classList.add("checkbox-filled")
      : activeCheckbox.classList.remove("checkbox-filled");

    checked
      ? currentTaskItem.classList.add("completed")
      : currentTaskItem.classList.remove("completed");
  });
};

selectAll.addEventListener("change", handleSelectAllChange);

const handleFiltersChange = (event) => {
  const { value } = event.target;

  // completed | pending | all

  switch (value) {
    case "all":
      list.innerHTML = "";

      tasksList.forEach((t) => {
        setTaskItemUI(t);
        if (t.isCompleted) {
          markItemAsComplete(t.id);
        } else {
          markItemAsInComplete(t.id);
        }
      });
      break;

    case "completed":
      // tasksList.filter(t => t.isCompleted)
      const completedTasks = tasksList.filter((t) => t.isCompleted === true);
      list.innerHTML = "";

      completedTasks.forEach((t) => {
        setTaskItemUI(t);
        markItemAsComplete(t.id);
      });

      if (completedTasks.length === 0) {
        list.innerHTML = "<p><i>There are no completed tasks</i><p>";
      }

      break;

    case "pending":
      // const pendingTasks = tasksList.filter((t) => !t.isCompleted);
      const pendingTasks = tasksList.filter((t) => t.isCompleted === false);
      list.innerHTML = "";

      pendingTasks.forEach((t) => {
        setTaskItemUI(t);
        markItemAsInComplete(t.id);
      });
      break;

    default:
      console.log("all");
      break;
  }
};

filtersDropdown.addEventListener("change", handleFiltersChange);

const setTaskItemUI = (obj) => {
  const currentId = obj.id;
  // create a new list item (li)
  const taskItem = document.createElement("li");
  // taskItem.classList.add("task-item")
  taskItem.className = "task-item";
  taskItem.id = `item_${currentId}`;
  // inner text set
  taskItem.innerHTML = `<div class="checkbox" onclick="markAsComplete(${currentId})"></div>
    <span>${obj.title}
    </span>
    <button id="edit_${currentId}" onclick="updateTask(${currentId})">Edit</button>
    <button onclick="deleteTask(${currentId})">Delete</button>`;

  // append the new li to existing ul
  list.appendChild(taskItem);
};

// SELECT ALL ALTERNATE

// if (checked) {
//   activeCheckbox.classList.add("checkbox-filled");
//   currentTaskItem.classList.add("completed");
// } else {
//   activeCheckbox.classList.remove("checkbox-filled");
//   currentTaskItem.classList.remove("completed");
// }
