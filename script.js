let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

function saveAssignments() {
    localStorage.setItem('assignments', JSON.stringify(assignments));
}

function renderAssignments() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    assignments.forEach(function(assignment) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${assignment.name}</td>
            <td>${assignment.subject}</td>
            <td>${assignment.due}</td>
            <td><span class="dot dot-${assignment.priority}"></span>${assignment.priority}</td>
        `;
        tbody.appendChild(newRow);
    });
}

const binders = document.querySelectorAll('.binder-wrapper');
const rows = document.querySelectorAll('tbody tr');

binders.forEach(function(binder) {
    binder.addEventListener('click', function() {
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

    form.reset();
});

renderAssignments();