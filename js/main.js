let elTodoForm = document.querySelector(".todo__form");
let elTodoInput = document.querySelector(".todo__input");
let elTodoList = document.querySelector(".todo__list");
let elAllBtn = document.querySelector(".btnAll");
let elCompletedBtn = document.querySelector(".btnCompleted");
let elUncompletedBtn = document.querySelector(".btnUncompleted");
let elAllCount = document.querySelector(".allCount");
let elCompletedCount = document.querySelector(".completedCount");
let elUncompletedCount = document.querySelector(".uncompletedCount");
let elTodosControls = document.querySelector(".todo__controls");
let elTodosTemplate = document.querySelector("#todo_item_template").content;

let storege = window.localStorage;
let localTodoArray = JSON.parse(storege.getItem("todoArray"));
let localCounter = JSON.parse(storege.getItem("counter"));
let todosArray = localTodoArray || [];
let counter = localCounter || 1;
function updateArray() {
  renderTodos(todosArray, elTodoList);
  storege.setItem("todoArray", JSON.stringify(todosArray));
  calculateTodos(todosArray);
}
elTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  let todoInput = elTodoInput.value.trim();
  if (todoInput) {
    let oneTodo = {
      id: counter++,
      todo: todoInput,
      isCompleted: false,
    };
    storege.setItem("counter", JSON.stringify(counter));

    todosArray.unshift(oneTodo);
    elTodoInput.value = null;
  }
  updateArray();
});

function renderTodos(array, wrapper) {
  wrapper.innerHTML = null;
  let todoFragment = document.createDocumentFragment();
  array.forEach((item) => {
    let todoTemplate = elTodosTemplate.cloneNode(true);
    todoTemplate.querySelector(".todo__text").textContent = item.todo;
    todoTemplate.querySelector(".checkbox__todo").dataset.todoId = item.id;
    todoTemplate.querySelector(".todo__del-btn").dataset.todoId =
      item.isCompleted;
    if (item.isCompleted === true) {
      todoTemplate.querySelector(".checkbox__todo").checked = true;
    }

    todoFragment.appendChild(todoTemplate);
  });
  wrapper.appendChild(todoFragment);
}
renderTodos(todosArray, elTodoList);
elTodoList.addEventListener("click", (evt) => {
  let check = evt.target.matches(".checkbox__todo");

  if (check) {
    let checkboxId = evt.target.dataset.todoId;
    let foundTodo = todosArray.find((item) => {
      return item.id == checkboxId;
    });
    let foundTodoIndex = todosArray.findIndex((item) => {
      return item.id == checkboxId;
    });
    if (!foundTodo.isCompleted) {
      foundTodo.isCompleted = true;
      todosArray[foundTodoIndex].isCompleted = true;
    } else {
      foundTodo.isCompleted = false;
      todosArray[foundTodoIndex].isCompleted = false;
    }
    storege.setItem("todoArray", JSON.stringify(todosArray));
    calculateTodos(todosArray);
  }
  let checkForBtn = evt.target.matches(".todo__del-btn");
  if (checkForBtn) {
    let checkboxId = evt.target.dataset.todoId;
    let foundTodoIndex = todosArray.findIndex((item) => {
      return item.id == checkboxId;
    });
    todosArray.splice(foundTodoIndex, 1);
    updateArray();
  }
});
function calculateTodos(array) {
  let complatedTodos = array.filter((item) => item.isCompleted === true);
  let notComplatedTodos = array.filter((item) => item.isCompleted === false);
  let allTodoNumber = array.length;
  let complatedTodoNumber = allTodoNumber - notComplatedTodos.length;
  let notComplatedTodoNumber = allTodoNumber - complatedTodos.length;
  console.log(allTodoNumber, complatedTodoNumber, notComplatedTodoNumber);
  elAllCount.textContent = allTodoNumber;
  elCompletedCount.textContent = complatedTodoNumber;
  elUncompletedCount.textContent = notComplatedTodoNumber;
}
calculateTodos(todosArray);
elTodosControls.addEventListener("click", (evt) => {
  let allBtn = evt.target.matches(".btnAll");
  let complatedBtn = evt.target.matches(".btnCompleted");
  let unComplatedBtn = evt.target.matches(".btnUncompleted");

  if (allBtn) {
    renderTodos(todosArray, elTodoList);
  } else if (complatedBtn) {
    let complatedTodos = todosArray.filter((item) => item.isCompleted === true);
    renderTodos(complatedTodos, elTodoList);
  } else if (unComplatedBtn) {
    let notComplatedTodos = todosArray.filter(
      (item) => item.isCompleted === false
    );
    renderTodos(notComplatedTodos, elTodoList);
  }
});
