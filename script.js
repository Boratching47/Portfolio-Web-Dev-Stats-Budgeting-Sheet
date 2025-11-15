// ---------- DARK MODE ----------
const toggleBtn = document.createElement("button");
toggleBtn.id = "dark-toggle";
toggleBtn.textContent = "Dark Mode";
document.body.appendChild(toggleBtn);

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = 
    document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
});

// ---------- BUDGET SYSTEM ----------
let entries = [];

const form = document.getElementById("budget-form");
const tableBody = document.querySelector("#budget-table tbody");

const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

// CHART ELEMENTS
let incomeExpenseChart, pieChart;

// ---------- ADD ENTRY ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  entries.push({ desc, amount, type });

  updateTable();
  updateSummary();
  updateCharts();

  form.reset();
});

// ---------- TABLE RENDER ----------
function updateTable() {
  tableBody.innerHTML = "";

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.desc}</td>
      <td>$${entry.amount}</td>
      <td style="color:${entry.type === "income" ? "var(--income)" : "var(--expense)"}">
        ${entry.type}
      </td>
      <td><button onclick="deleteEntry(${index})">Delete</button></td>
    `;

    tableBody.appendChild(row);
  });
}

function deleteEntry(i) {
  entries.splice(i, 1);
  updateTable();
  updateSummary();
  updateCharts();
}

// ---------- SUMMARY ----------
function updateSummary() {
  const income = entries.filter(e => e.type === "income")
                        .reduce((sum, e) => sum + e.amount, 0);

  const expense = entries.filter(e => e.type === "expense")
                         .reduce((sum, e) => sum + e.amount, 0);

  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  balanceEl.textContent = income - expense;
}

// ---------- CHARTS ----------
function updateCharts() {
  const income = entries.filter(e => e.type === "income")
                        .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === "expense")
                         .reduce((sum, e) => sum + e.amount, 0);

  // PIE CHART
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(document.getElementById("pie-chart"), {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#2ecc71", "#e74c3c"],
      }]
    },
    options: {
      animation: { animateScale: true, animateRotate: true },
    }
  });

  // BAR CHART
  if (incomeExpenseChart) incomeExpenseChart.destroy();

  incomeExpenseChart = new Chart(document.getElementById("bar-chart"), {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#2ecc71", "#e74c3c"],
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 700, easing: "easeOutCubic" }
    }
  });
}
