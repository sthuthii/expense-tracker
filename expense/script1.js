let list = [];

const listForm = document.getElementById('list-form');
const toDoList = document.getElementById('tList');


listForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const date1 = document.getElementById('date-of-entry').value;
  const description = document.getElementById('description').value;
  const date2 = document.getElementById('due-date').value;

  if (!date1 || !description || !date2) {
    alert('Please provide valid input for all fields.');
    return;
  }

  const lists = { date1, description, date2 };
  list.push(lists);

  updateList();
  saveToLocalStorage();

  listForm.reset();
});


function updateList() {
  toDoList.innerHTML = ''; 
  list.forEach((lists, index) => {
    const li = document.createElement('li');
    li.textContent = `${lists.date1}-----------${lists.description}--------Due: ${lists.date2}`;

    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginLeft = '10px';
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        li.style.textDecoration = 'line-through'; 
      } else {
        li.style.textDecoration = 'none'; 
      }
    });

    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.addEventListener('click', function () {
      deleteList(index); 
    });

    li.appendChild(checkbox);
    li.appendChild(deleteBtn);
    toDoList.appendChild(li);
  });
}


function saveToLocalStorage() {
  localStorage.setItem('to-do', JSON.stringify(list));
}


function loadFromLocalStorage() {
  const storedList = JSON.parse(localStorage.getItem('to-do'));
  if (storedList) {
    list = storedList;
    updateList();
  }
}


function deleteList(index) {
  list.splice(index, 1); 
  updateList();
  saveToLocalStorage();
}


window.addEventListener('load', loadFromLocalStorage);
