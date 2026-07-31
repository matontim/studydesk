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

const binders = document.querySelectorAll('.binder-wrapper');
const rows = document.querySelectorAll('tbody tr');

binders.forEach(function(binder) {
    binder.addEventListener('click', function() {
        activeSubject = binder.querySelector('.shelf-tag').textContent;
        const subject = binder.querySelector('.shelf-tag').textContent;

        rows.forEach(function(row) {
            const rowSubject = row.cells[1].textContent;

            if (subject === 'All') {
                row.style.display = '';
            } else if (rowSubject === subject) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        binders.forEach(function(b) {
            b.classList.remove('active');
        });
        binder.classList.add('active');
    });
});

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

renderAssignments();
renderDueSoon();
renderBinders();