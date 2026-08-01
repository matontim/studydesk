document.getElementById('btn-login').addEventListener('click', async function() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    } else {
        document.getElementById('auth-message').textContent = data.message;
    }
});

document.getElementById('btn-show-register').addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('btn-show-login').addEventListener('click', function() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('btn-register').addEventListener('click', async function() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    console.log(username, password);

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    document.getElementById('auth-message').textContent = data.message;

    if (data.success) {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }
});

let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
let activeSubject = 'All'

function saveAssignments() {
    localStorage.setItem('assignments', JSON.stringify(assignments));
}

function renderAssignments() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    assignments.forEach(function(assignment, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="checkbox" ${assignment.done ? 'checked' : ''}></td>
            <td>${assignment.name}</td>
            <td>${assignment.subject}</td>
            <td>${assignment.due}</td>
            <td><span class="dot dot-${assignment.priority}"></span>${assignment.priority}</td>
            <td><button class="delete-btn">x</button></td>
        `;

        if (assignment.done) {
            newRow.classList.add('done');
        }

        const checkbox = newRow.querySelector('input');
        checkbox.addEventListener('change', function() {
            assignments[index].done = checkbox.checked;
            saveAssignments();
            renderAssignments();
        });

        const deleteBtn = newRow.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            assignments.splice(index, 1);
            saveAssignments();
            renderAssignments();
        });

        tbody.appendChild(newRow);
        });

        const allRows = document.querySelectorAll('tbody tr');
        allRows.forEach(function(row) {
            if (activeSubject === 'All') {
                row.style.display = '';
            } else if (row.cells[2].textContent.toLowerCase() === activeSubject.toLowerCase()) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
}

function renderDueSoon() {
    const today = new Date();
    const board = document.querySelector('.bulletin-board');
    board.innerHTML = '<h2>Due Soon</h2>';

    assignments.forEach(function(assignment) {
        const dueDate = new Date(assignment.due);
        const daysUntilDue = (dueDate - today) / (1000 * 60 * 60 * 24);

        if (daysUntilDue <= 3 && daysUntilDue >= 0 && !assignment.done) {
            const note = document.createElement('div');
            note.classList.add('note');
            note.innerHTML = `
                <p>${assignment.due} </p>
                <p>${assignment.name} </p>
                <p>${assignment.subject} </p>
            `;
            board.appendChild(note);
        }
    })
}

function renderBinders() {
    const shelf = document.querySelector('.binder-shelf');
    shelf.innerHTML = '';

    const colors = ['binder-blue', 'binder-red', 'binder-green', 'binder-yellow', 'binder-purple', 'binder-orange'];
    const subjects = ['All', ...new Set(assignments.map(function(a) { return a.subject; }))];

    subjects.forEach(function(subject, index) {
        const colorClass = subject === 'All' ? 'binder-blue' : colors[index % colors.length];

        const wrapper = document.createElement('section');
        wrapper.classList.add('binder-wrapper');
        wrapper.innerHTML = `
        <div class="binder ${colorClass}">
            <div class="binder-ring"></div>
            <div class="binder-ring"></div>
            <div class="binder-ring"></div>
        </div>
        <div class="shelf-tag">${subject}</div>
        `;
        
        wrapper.addEventListener('click', function() {
            activeSubject = subject;
            document.querySelectorAll('.binder-wrapper').forEach(function(b) {
                b.classList.remove('active');
            });
            wrapper.classList.add('active');
            renderAssignments();
        });

        shelf.appendChild(wrapper);
    });
}

function renderWeekView() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() + i);

        const dayE1 = document.createElement('div');
        dayE1.classList.add('cal-day');

        const isToday = i === 0;
        if (isToday) dayE1.classList.add('today');

        const dayAssignments = assignments.filter(function(a) {
            const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            return a.due === dateStr;
        });

        dayE1.innerHTML = `
        <span class="cal-day-label">${days[day.getDay()]} ${day.getDate()}</span>
        ${dayAssignments.map(function(a) {
            return `<span class="cal-dot" style="background:red">${a.name}</span>`;
        }).join('')}
        `;

        grid.appendChild(dayE1);
    }
}

function renderMonthView() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const monthHeader = document.createElement('div');
    monthHeader.classList.add('cal-month-title');
    monthHeader.textContent = `${monthNames[month]} ${year}`;
    grid.appendChild(monthHeader);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    days.forEach(function(day) {
        const header = document.createElement('div');
        header.classList.add('cal-header-cell');
        header.textContent = day;
        grid.appendChild(header);
    });

    for (let i = 0; i < firstDay.getDay(); i++) {
        const empty = document.createElement('div');
        empty.classList.add('cal-day', 'empty');
        grid.appendChild(empty);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(year, month, d);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        const dayE1 = document.createElement('div');
        dayE1.classList.add('cal-day');

        if (d === today.getDate()) dayE1.classList.add('today');

        const dayAssignments = assignments.filter(function(a) {
            return a.due === dateStr;
        });

        dayE1.innerHTML = `
        <span class="cal-day-label">${d}</span>
        ${dayAssignments.map(function(a) {
            return `<span class="cal-dot"></span>`;
        }).join('')}
        `;

        grid.appendChild(dayE1);
    }
}

const form = document.getElementById('add-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('input-name').value;
    const subject = document.getElementById('input-subject').value;
    const due = document.getElementById('input-due').value;
    const priority = document.getElementById('input-priority').value;

    const newAssignment = { name: name, subject: subject, due: due, priority: priority };
    assignments.push(newAssignment);
    saveAssignments();
    renderAssignments();
    renderBinders();

    form.reset();
});

document.getElementById('btn-week').addEventListener('click', function() {
    document.getElementById('btn-week').classList.add('active');
    document.getElementById('btn-month').classList.remove('active');
    renderWeekView();
});

document.getElementById('btn-month').addEventListener('click', function() {
    document.getElementById('btn-month').classList.add('active');
    document.getElementById('btn-week').classList.remove('active');
    renderMonthView();
});

renderAssignments();
renderDueSoon();
renderBinders();
renderWeekView();