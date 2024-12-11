let expenses = [];
let budget = 0;
let expenseChart = null;

const expenseForm = document.getElementById('expense-form');
const expensesList = document.getElementById('expenses');
const categorySummary = document.getElementById('category-summary');
const budgetForm = document.getElementById('budget-form');
const budgetInput = document.getElementById('budget');
const progressBar = document.getElementById('progress-bar');
const status = document.getElementById('budget-status');


expenseForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('spending-date').value;

  if (!description || !category || isNaN(amount) || amount <= 0) {
    alert('Please provide valid input.');
    return;
  }

  const expense = { description, category, amount, date };
  expenses.push(expense);

  updateExpenses();
  updateSummary();
  saveToLocalStorage();
  renderPieChart();
  updateProgressBar();

  expenseForm.reset();
});


budgetForm.addEventListener('submit', function (e) {
  e.preventDefault();
  setBudget();
});


window.addEventListener('load', function () {
  loadFromLocalStorage();
});

function updateExpenses() {
  expensesList.innerHTML = '';
  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.textContent = `${expense.description} (${expense.date}) - ${expense.category}: ₹${expense.amount.toFixed(2)}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.addEventListener('click', function () {
      deleteExpense(index);
    });

    li.appendChild(deleteBtn);
    expensesList.appendChild(li);
  });
}


function updateSummary() {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  categorySummary.innerHTML = '';
  for (const [category, total] of Object.entries(categoryTotals)) {
    const li = document.createElement('li');
    li.textContent = `${category}: ₹${total.toFixed(2)}`;
    categorySummary.appendChild(li);
  }
}


function deleteExpense(index) {
  expenses.splice(index, 1);
  updateExpenses();
  updateSummary();
  saveToLocalStorage();
  renderPieChart();
  updateProgressBar();
}


function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('budget', budget.toString());
}


function loadFromLocalStorage() {
  const storedExpenses = JSON.parse(localStorage.getItem('expenses'));
  const storedBudget = parseFloat(localStorage.getItem('budget'));

  if (storedExpenses) {
    expenses = storedExpenses;
    updateExpenses();
    updateSummary();
    renderPieChart();
  }

  if (!isNaN(storedBudget)) {
    budget = storedBudget;
    budgetInput.value = budget;
    updateProgressBar();
  }
}

// Render Pie Chart
function renderPieChart() {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const ctx = document.getElementById('expenseChart').getContext('2d');

  // Destroy existing chart to avoid duplication
  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categoryTotals),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    },
  });
}

// Set or update budget
function setBudget() {
  const newBudget = parseFloat(budgetInput.value);

  if (isNaN(newBudget) || newBudget <= 0) {
    alert('Please enter a valid budget.');
    return;
  }

  budget = newBudget;
  saveToLocalStorage();
  updateProgressBar();
}

// Update progress bar and status
function updateProgressBar() {
  const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const savings = budget - totalSpent;

  const progressPercentage = Math.min((totalSpent / budget) * 100, 100);
  progressBar.style.width = progressPercentage + '%';

  if (savings >= 0) {
    status.textContent = `You're ₹${savings.toFixed(2)} under your budget!`;
    progressBar.style.background = '#4caf50';
  } else {
    status.textContent = `You've exceeded your budget by ₹${Math.abs(savings).toFixed(2)}!`;
    progressBar.style.background = '#f44336';
  }
}
