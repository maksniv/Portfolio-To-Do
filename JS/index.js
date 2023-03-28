let tasks = [];
const TASK_URL = 'https://jsonplaceholder.typicode.com/users';
const createTaskBlock = document.querySelector('.create-task-block');
const containerTasksList = document.querySelector('.container__tasks-list');
const bottomButtonDeleteAll = document.querySelector(
  '.bottom__buttom-delete-all'
);

const createTaskItem = (taskId, taskTitle, taskCompleted) => {
  const taskItem = document.createElement('div');
  taskItem.dataset.taskId = taskId;
  taskItem.className = 'tasks-list__item';

  const taskCheckboxLabel = document.createElement('label');
  taskCheckboxLabel.setAttribute('for', `${taskId}`);
  taskCheckboxLabel.innerText = `${taskTitle}`;
  if (taskCompleted === true) {
    taskCheckboxLabel.className = 'tasks-list__item-checkbox-label crossing';
  } else {
    taskCheckboxLabel.className = 'tasks-list__item-checkbox-label';
  }
  taskItem.append(taskCheckboxLabel);

  const taskCheckboxSpan = document.createElement('span');
  taskCheckboxSpan.className = 'tasks-list__item-checkbox-span';
  taskCheckboxLabel.prepend(taskCheckboxSpan);

  const taskCheckbox = document.createElement('input');
  taskCheckbox.setAttribute('type', 'checkbox');
  taskCheckbox.setAttribute('id', `${taskId}`);
  taskCheckbox.className = 'tasks-list__item-checkbox';
  taskCheckbox.checked = taskCompleted;
  taskCheckboxLabel.prepend(taskCheckbox);

  const taskDeleteButton = document.createElement('button');
  taskDeleteButton.className = 'tasks-list__item-task-delete-button';
  taskDeleteButton.dataset.deleteTaskId = taskId;
  taskItem.append(taskDeleteButton);

  const taskDeleteButtonSpan = document.createElement('span');
  taskDeleteButtonSpan.innerText = 'close';
  taskDeleteButtonSpan.className = 'material-symbols-outlined';
  taskDeleteButton.append(taskDeleteButtonSpan);

  return taskItem;
};

const loadTaskItem = async (id) => {
  try {
    const requests = await fetch(`${TASK_URL}/${id}/todos?_limit=3`);
    const response = await requests.json();
    response.forEach((element) => {
      const taskItem = createTaskItem(
        element.id,
        element.title,
        element.completed
      );
      containerTasksList.append(taskItem);
      addTaskInObj(element.id, element.title, element.completed);
    });
  } catch (error) {
    console.log(error);
  } finally {
    countItems();
  }
};

const addTaskInObj = (idValue, inputValue, completedStatus) => {
  let task = {
    id: idValue,
    title: inputValue,
    completed: completedStatus,
  };
  tasks.push(task);
  saveToLocalStorage();
};

const getRandomIdTasks = () => {
  let id = Math.floor(Math.random() * (10 - 1) + 1);
  return id;
};

const removeTaskItemInObj = (deleteId) => {
  const delElArray = tasks.findIndex((task) => {
    return task.id == deleteId;
  });
  tasks.splice(delElArray, delElArray + 1);

  saveToLocalStorage();
};

const removeTaskItem = (deleteId) => {
  const delEl = document.querySelector(`[data-task-id="${deleteId}"]`);
  if (delEl) {
    delEl.remove();
  }
  countItems();
};

const countItems = () => {
  const сhildrenContainerTaskList = containerTasksList.children;
  const countTask = Array.from(сhildrenContainerTaskList).length;
  const bottomCountItems = document.querySelector('.bottom__count-items');
  bottomCountItems.innerText = `Всего заметок: ${countTask}`;
};

const addTaskElement = (event) => {
  event.preventDefault();
  const inputValue = event.target.taskName.value.trim();
  const idValue = Date.now();
  if (inputValue) {
    const taskItem = createTaskItem(idValue, inputValue, false);
    addTaskInObj(idValue, inputValue, false);
    containerTasksList.append(taskItem);
    const createTaskBlockInput = document.querySelector(
      '.create-task-block__input'
    );
    createTaskBlockInput.value = '';
    countItems();
  }
};

const deleteAll = (event) => {
  const isDeleteButton = event.target.closest('.bottom__buttom-delete-all');
  const сhildrenContainerTaskList = containerTasksList.children;
  if (isDeleteButton) {
    Array.from(сhildrenContainerTaskList).forEach((item) => {
      removeTaskItem(item.dataset.taskId);
      removeTaskItemInObj(item.dataset.taskId);
    });
  }
};

const toggleCheckbox = (isCheckbox) => {
  const items = document.querySelector(`[for="${isCheckbox.id}"]`);
  if (isCheckbox.checked) {
    items.classList.add('crossing');
    items.checked = true;
  } else {
    items.classList.remove('crossing');
    items.checked = false;
  }
};

const toggleCheckboxInObj = (isCheckbox) => {
  const toggle = tasks.find((task) => {
    return task.id == isCheckbox.id;
  });

  if (isCheckbox.checked) {
    toggle.completed = true;
  } else {
    toggle.completed = false;
  }
  saveToLocalStorage();
};

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

createTaskBlock.addEventListener('submit', addTaskElement);

containerTasksList.addEventListener('click', (event) => {
  const isDeleteButton = event.target.closest(
    '.tasks-list__item-task-delete-button'
  );
  const isCheckbox = event.target.closest('.tasks-list__item-checkbox');

  if (isDeleteButton) {
    removeTaskItem(isDeleteButton.dataset.deleteTaskId);
    removeTaskItemInObj(isDeleteButton.dataset.deleteTaskId);
  }
  if (isCheckbox) {
    toggleCheckbox(isCheckbox);
    toggleCheckboxInObj(isCheckbox);
  }
});

bottomButtonDeleteAll.addEventListener('click', deleteAll);

if (localStorage.getItem('tasks')) {
  countItems();
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => {
    const taskItem = createTaskItem(task.id, task.title, task.completed);
    containerTasksList.append(taskItem);
    countItems();
  });
} else {
  loadTaskItem(getRandomIdTasks());
}

console.log('Done');
