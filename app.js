let transactions = [];

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const incomeBtn = document.getElementById('income-btn');
const expenseBtn = document.getElementById('expense-btn');
const addTransactionBtn = document.getElementById('add-transaction');
const transactionsList = document.getElementById('transactions-list');
const categoryList = document.getElementById('category-list');
const incomeExpenseChart = document.getElementById('income-expense-chart');

const totalBalanceEl = document.getElementById('total-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');

let transactionType = 'expense';

function setActiveType(type) {
    transactionType = type;
    
    if (type === 'income') {
        incomeBtn.classList.add('active');
        expenseBtn.classList.remove('active');
    } else {
        expenseBtn.classList.add('active');
        incomeBtn.classList.remove('active');
    }
}

function formatAmount(amount) {
    return amount.toFixed(3) + ' <span class="tnd">TND</span>';
}

function updateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });
    
    const totalBalance = totalIncome - totalExpense;
    
    totalBalanceEl.innerHTML = formatAmount(totalBalance);
    totalIncomeEl.innerHTML = formatAmount(totalIncome);
    totalExpenseEl.innerHTML = formatAmount(totalExpense);
}

function getCategoryInfo(category) {
    const categories = {
        food: { icon: 'fas fa-utensils', color: '#e74c3c', name: 'Food & Drinks' },
        transport: { icon: 'fas fa-bus', color: '#3498db', name: 'Transport' },
        education: { icon: 'fas fa-book', color: '#9b59b6', name: 'Education' },
        entertainment: { icon: 'fas fa-film', color: '#1abc9c', name: 'Entertainment' },
        housing: { icon: 'fas fa-home', color: '#f39c12', name: 'Housing' },
        shopping: { icon: 'fas fa-shopping-bag', color: '#2ecc71', name: 'Shopping' },
        health: { icon: 'fas fa-heartbeat', color: '#e67e22', name: 'Health' },
        other: { icon: 'fas fa-ellipsis-h', color: '#95a5a6', name: 'Other' }
    };
    
    return categories[category] || categories.other;
}

function renderTransactions() {
    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="no-transactions">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet. Add your first transaction!</p>
            </div>
        `;
        return;
    }
    
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    transactionsList.innerHTML = sortedTransactions.map(transaction => {
        const categoryInfo = getCategoryInfo(transaction.category);
        const typeClass = transaction.type === 'income' ? 'income' : 'expense';
        const typeIcon = transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up';
        
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                        <span class="transaction-category" style="background-color: ${categoryInfo.color}20; color: ${categoryInfo.color}">
                            <i class="${categoryInfo.icon}" style="margin-right: 5px;"></i>
                            ${categoryInfo.name}
                        </span>
                        <span style="font-size: 0.85rem; color: #999;">${formattedDate}</span>
                    </div>
                </div>
                <div class="transaction-amount ${typeClass}">
                    <i class="fas ${typeIcon}"></i> ${formatAmount(transaction.amount)}
                </div>
            </div>
        `;
    }).join('');
}

function renderExpenseBreakdown() {
    const expensesByCategory = {};
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            totalExpenses += transaction.amount;
            
            if (!expensesByCategory[transaction.category]) {
                expensesByCategory[transaction.category] = 0;
            }
            
            expensesByCategory[transaction.category] += transaction.amount;
        }
    });
    
    if (Object.keys(expensesByCategory).length === 0) {
        categoryList.innerHTML = '<li class="no-transactions">No expense data available</li>';
    } else {
        const sortedCategories = Object.keys(expensesByCategory).sort(
            (a, b) => expensesByCategory[b] - expensesByCategory[a]
        );
        
        categoryList.innerHTML = sortedCategories.map(category => {
            const amount = expensesByCategory[category];
            const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
            const categoryInfo = getCategoryInfo(category);
            
            return `
                <li class="category-item">
                    <div class="category-name">
                        <div class="category-icon" style="background-color: ${categoryInfo.color}">
                            <i class="${categoryInfo.icon}"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600;">${categoryInfo.name}</div>
                            <div class="category-percentage">${percentage}%</div>
                        </div>
                    </div>
                    <div class="category-amount">${formatAmount(amount)}</div>
                </li>
            `;
        }).join('');
    }
    
    let totalIncome = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        }
    });
    
    if (totalIncome + totalExpenses === 0) {
        incomeExpenseChart.innerHTML = 'No data to display';
        return;
    }
    
    const incomePercentage = Math.round((totalIncome / (totalIncome + totalExpenses)) * 100);
    const expensePercentage = 100 - incomePercentage;
    
    incomeExpenseChart.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div>
                    <div style="font-weight: bold; color: #2ecc71;">Income</div>
                    <div>${formatAmount(totalIncome)}</div>
                    <div style="font-size: 0.9rem; color: #777;">${incomePercentage}%</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold; color: #e74c3c;">Expenses</div>
                    <div>${formatAmount(totalExpenses)}</div>
                    <div style="font-size: 0.9rem; color: #777;">${expensePercentage}%</div>
                </div>
            </div>
            <div style="display: flex; height: 30px; border-radius: 6px; overflow: hidden; margin-top: 15px;">
                <div style="width: ${incomePercentage}%; background-color: #2ecc71; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                    ${incomePercentage > 10 ? 'Income' : ''}
                </div>
                <div style="width: ${expensePercentage}%; background-color: #e74c3c; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                    ${expensePercentage > 10 ? 'Expenses' : ''}
                </div>
            </div>
        </div>
    `;
}

function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    
    if (!description) {
        alert('Please enter a description');
        return;
    }
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!category) {
        alert('Please select a category');
        return;
    }
    
    const newTransaction = {
        id: transactions.length + 1,
        description,
        amount,
        type: transactionType,
        category,
        date: new Date().toISOString().split('T')[0] 
    };
    
    transactions.push(newTransaction);
    
    updateSummary();
    renderTransactions();
    renderExpenseBreakdown();
    
    descriptionInput.value = '';
    amountInput.value = '';
    categorySelect.value = '';
    
    descriptionInput.focus();
    
    alert('Transaction added successfully!');
}

incomeBtn.addEventListener('click', () => setActiveType('income'));
expenseBtn.addEventListener('click', () => setActiveType('expense'));
addTransactionBtn.addEventListener('click', addTransaction);

descriptionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTransaction();
});

amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTransaction();
});

function initApp() {
    updateSummary(); 
    renderTransactions(); 
    renderExpenseBreakdown(); 
}

initApp();

