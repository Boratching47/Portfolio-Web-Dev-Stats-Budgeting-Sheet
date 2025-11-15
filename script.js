// -------------------------
// Dark Mode Toggle
// -------------------------
const darkToggle = document.getElementById('dark-toggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// -------------------------
// Theme Selector
// -------------------------
const themeSelect = document.getElementById('theme-select');
themeSelect.addEventListener('change', (e) => {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.background = `linear-gradient(135deg, ${e.target.value}, #00c6ff)`;
    });
});

// -------------------------
// Budget Tracker Logic
// -------------------------
const budgetForm = document.getElementById('budget-form');
const budgetTable = document.querySelector('#budget-table tbody');
let budgetData = [];

budgetForm.addEventListener('submit', e => {
    e.preventDefault();
    const desc = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    const item = { desc, amount, type };
    budgetData.push(item);
    renderBudget();
    budgetForm.reset();
});

function renderBudget() {
    budgetTable.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;

    budgetData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.desc}</td>
            <td>$${item.amount.toFixed(2)}</td>
            <td>${item.type}</td>
            <td><button class="btn btn-outline" onclick="deleteItem(${index})">Delete</button></td>
        `;
        budgetTable.appendChild(row);

        if(item.type === 'income') totalIncome += item.amount;
        else totalExpense += item.amount;
    });

    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expense').textContent = totalExpense.toFixed(2);
    document.getElementById('balance').textContent = (totalIncome - totalExpense).toFixed(2);

    updateCharts(totalIncome, totalExpense);
}

function deleteItem(index) {
    budgetData.splice(index, 1);
    renderBudget();
}

// -------------------------
// Charts
// -------------------------
let pieChart, barChart;

function updateCharts(income, expense) {
    const pieData = {
        labels: ['Income', 'Expense'],
        datasets: [{
            data: [income, expense],
            backgroundColor: ['#0077ff', '#ff5757'],
            hoverOffset: 10
        }]
    };

    const barData = {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Amount ($)',
            data: [income, expense],
            backgroundColor: ['#0077ff', '#ff5757']
        }]
    };

    if(pieChart) pieChart.destroy();
    if(barChart) barChart.destroy();

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: pieData,
        options: {
            responsive: true,
            maintainAspectRatio: false, // allow small size
            plugins: { legend: { position: 'bottom' } }
        }
    });

    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: barData,
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}
