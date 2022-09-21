const $ = document;
const addTodoButton = $.querySelector(".add-btn");
const addTodoInput = $.querySelector('input[type="text"]');
const deleteAllTodos = $.querySelector(".delete-all");

const todosContaienr = $.querySelector(".todos");
const filterSelectElement = $.querySelector(".filter-select");

window.addEventListener("load", callEachTodos);
addTodoInput.addEventListener("keydown", handleAddTodoWithEnter);
addTodoButton.addEventListener("click", handleCreateTodo);
deleteAllTodos.addEventListener("click", handleDeleteAllTodos);
filterSelectElement.addEventListener("change", handleFilterTodos);

function handleAddTodoWithEnter(e) {
  if (e.key === "Enter") {
    handleCreateTodo();
  }
}

function handleDeleteAllTodos() {
  localStorage.removeItem("todos");
  todosContaienr.innerHTML = "";
}

function getTodos() {
  const savedTodos = localStorage.getItem("todos");
  const savedTodosArr = JSON.parse(savedTodos);

  return savedTodosArr;
}

function handleFilterTodos(e) {
  const filterValue = e.target.value;

  callEachTodos(filterValue);
}

function callEachTodos(filter = "") {
  const todos = getTodos();

  if (todos) {
    todosContaienr.innerHTML = "";

    const filteredTodos = todos.filter((todo) =>
      filter == "compeleted"
        ? todo.isDone
        : filter == "active"
        ? !todo.isDone
        : todo
    );

    filteredTodos.forEach((todo) => createTodoElement(todo));
  }
}

function handleCreateTodo() {
  const title = addTodoInput.value;
  const todos = getTodos() || [];

  if (title) {
    const todo = {
      id: (Math.random() * 1000).toString(16),
      createdAt: Date.now(),
      title,
      isDone: false,
    };

    const todosArray = [...todos, todo];

    setTodos(todosArray);
    createTodoElement(todo);

    addTodoInput.value = "";
    addTodoInput.focus();
  }
}

function setTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function createTodoElement(todo = {}) {
  let todoNode = `
<div data-id=${
    todo.id
  } class="w-100 opacity-anim rounded shadow p-2 row bg-white align-items-center">
    <div class="col-1">
        <input type="checkbox" ${
          todo.isDone ? "checked" : ""
        } class="form-check-input check-done" />
    </div>
    <div class="col-7 mt-3">
        <p class="fs-4" style="text-decoration:${
          todo.isDone ? "line-through" : "none"
        }">${todo.title}</p>
    </div>
    <div class="col-4 d-flex flex-column align-items-end">
        <div class="d-flex gap-2 fs-5 align-items-center">
          <div class="align-items-center d-flex gap-2 text-primary" role="button">
	      <input placeholder='New Title...' type='text' class="opacity-anim form-control shadow-none d-none">
        	 <label for='edit-check' role='button' class='edit-btn'>
		<i class="bi bi-pen edit-icon"></i>
		</label>
		</div>
          <div role="button" class="remove-btn">
               <i class="bi bi-trash text-danger remove-icon"></i>
          </div>
        </div>
        <div class='date mt-2'>
           <i class="bi bi-info-circle"></i>
           <span>created At : ${handleTodoCreatedDate(todo.createdAt)}</span>
        </div> 
    </div>
</div>	`;

  insertNodeInDom(todoNode);
}

function handleTodoCreatedDate(todoCreatedDate) {
  let todoDate = new Date(todoCreatedDate);
  let indexOfGmt = todoDate.toString().indexOf("GMT");

  return todoDate.toString().slice(0, indexOfGmt);
}

function insertNodeInDom(todoNode) {
  todosContaienr.insertAdjacentHTML("afterbegin", todoNode);

  setEvents();
}

function setEvents() {
  $.querySelector(".edit-btn").addEventListener("click", handleEditButton);
  $.querySelector(".remove-btn").addEventListener("click", handleRemoveTodo);
  $.querySelector(".check-done").addEventListener("click", markTodoAsDone);
}

function handleEditButton() {
  const inputTarget = this.previousElementSibling;

  inputTarget.classList.toggle("d-none");
  inputTarget.addEventListener("keydown", handleTodoEdit);
}

function handleTodoEdit(e) {
  if (e.key === "Enter") {
    const inputValue = e.target.value;

    if (inputValue) {
      const { todoTarget, todoTargetIndex, todosArray } = getSingleTodo(this);
      const todoTargetObject = todosArray[todoTargetIndex];

      todoTargetObject.title = inputValue;
      // Todo Title TextContent
      todoTarget.children[1].firstElementChild.textContent = inputValue;

      setTodos(todosArray);

      e.target.value = "";
      e.target.classList.add("d-none");
    }
  }
}

function markTodoAsDone() {
  const { todoTarget, todoTargetIndex, todosArray } = getSingleTodo(this);

  const findTodo = todosArray[todoTargetIndex];
  findTodo.isDone = !findTodo.isDone;

  // Todo Title Text decoration
  todoTarget.children[1].firstElementChild.style.textDecoration =
    findTodo.isDone ? "line-through" : "none";

  setTodos(todosArray);
}

function handleRemoveTodo() {
  const { todosArray, todoTarget, todoTargetIndex } = getSingleTodo(this);

  todoTarget.remove();

  todosArray.splice(todoTargetIndex, 1);
  setTodos(todosArray);
}

function getSingleTodo(clickedBtn) {
  const todosArray = getTodos();
  // get the Todo Element from clicked Button
  const todoTarget = clickedBtn.closest("div[data-id]");
  const todoTargetIndex = todosArray.findIndex(
    (todo) => todo.id === todoTarget.dataset.id
  );

  return { todosArray, todoTarget, todoTargetIndex };
}

