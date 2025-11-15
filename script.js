// Dark Mode Toggle
const darkToggle = document.getElementById('dark-toggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Theme Selector
const themeSelect = document.getElementById('theme-select');
let themeColor = '#0077ff'; // default theme color

themeSelect.addEventListener('change', (e) => {
    themeColor = e.target.value;
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.background = `linear-gradient(135deg, ${themeColor}, #00c6ff)`;
    });
    updateCharts(totalIncome, totalExpense); // update chart colors dynamically
});

// Budget Tracker
const budgetForm = document.getElementById('budget-form');
const budgetTable = document.querySelector('#budget-table tbody');
let budgetData = [];
let totalIncome = 0;
let totalExpense = 0;

budgetForm.addEventListener('submit', e => {
    e.preventDefault();
    const desc = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    budgetData.push({ desc, amount, type });
    budgetForm.reset();
    renderBudget();
});

function renderBudget() {
    budgetTable.innerHTML = '';
    totalIncome = 0;
    totalExpense = 0;

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

// Charts
let pieChart, barChart;

function updateCharts(income, expense) {
    const pieData = {
        labels: ['Income', 'Expense'],
        datasets: [{
            data: [income, expense],
            backgroundColor: [themeColor, '#ff5757'],
            hoverOffset: 10
        }]
    };

    // Bar chart gradient
    const barCtx = document.getElementById('barChart').getContext('2d');
    const gradient = barCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, themeColor);
    gradient.addColorStop(1, '#00c6ff');

    const barData = {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Amount ($)',
            data: [income, expense],
            backgroundColor: [gradient, '#ff5757']
        }]
    };

    const pieCtx = document.getElementById('pieChart').getContext('2d');

    if(pieChart) pieChart.destroy();
    if(barChart) barChart.destroy();

    // Pie chart
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: pieData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    // Bar chart
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: barData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}
