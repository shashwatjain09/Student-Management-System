let studentDatabase =
JSON.parse(localStorage.getItem("students")) || [
    { name: "Aarav Singhal", id: "CSE-2026-01", course: "Computer Science", email: "aarav.s@univ.edu" },
    { name: "Meera Nair", id: "DS-2026-44", course: "Data Science", email: "meera.n@univ.edu" },
    { name: "Kabir Malhotra", id: "CSE-2026-19", course: "Cyber Security", email: "kabir.m@univ.edu" },
    { name: "Isha Kapoor", id: "IT-2026-32", course: "Information Technology", email: "isha.k@univ.edu" }
];

if (!localStorage.getItem("students")) {
    localStorage.setItem(
        "students",
        JSON.stringify(studentDatabase)
    );
}
const rosterDataRows = document.getElementById('rosterDataRows');
const studentRegistrationForm = document.getElementById('studentRegistrationForm');
const rosterSearch = document.getElementById('rosterSearch');
const metricTotal = document.getElementById('metricTotal');
const fallbackEmptyState = document.getElementById('fallbackEmptyState');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');


window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        gsap.from('.navbar', { y: -50, opacity: 0, duration: 0.8, ease: 'power3.out' });
        gsap.from('.hero-section', { scale: 0.95, opacity: 0, duration: 1, ease: 'power2.out' });
        gsap.from('.floating-widget', { x: 50, opacity: 0, stagger: 0.2, duration: 0.8, delay: 0.3 });
    }
    renderRoster();
});
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
});
function renderRoster(targetData = studentDatabase) {
    rosterDataRows.innerHTML = '';
    metricTotal.innerText = studentDatabase.length;

    if (targetData.length === 0) {
        fallbackEmptyState.classList.remove('hidden');
        return;
    }
    fallbackEmptyState.classList.add('hidden');

    targetData.forEach(student => {
        
        const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const tableRow = document.createElement('tr');
        tableRow.setAttribute('data-target-id', student.id);
        tableRow.innerHTML = `
            <td>
                <div class="table-profile-cell">
                    <div class="avatar-circle">${initials}</div>
                    <span>${student.name}</span>
                </div>
            </td>
            <td><span class="mono-id">${student.id}</span></td>
            <td><span class="dept-tag">${student.course}</span></td>
            <td><span style="color: var(--text-sub);">${student.email}</span></td>
            <td>
                <button class="btn-row-delete" onclick="commitDeletion('${student.id}')" title="Wipe item">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        rosterDataRows.appendChild(tableRow);
    });
}
studentRegistrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('fullName').value.trim();
    const id = document.getElementById('regID').value.trim().toUpperCase();
    const course = document.getElementById('department').value;
    const email = document.getElementById('emailAddress').value.trim();

    
    if (studentDatabase.some(record => record.id === id)) {
        alert("Operation Halt: This specific Roll Number/ID already registers within the operational matrix.");
        return;
    }

    const compiledObject = { name, id, course, email };
    studentDatabase.unshift(compiledObject); 
    localStorage.setItem(
    "students",
    JSON.stringify(studentDatabase)
);

    renderRoster();
    studentRegistrationForm.reset();

    
    setTimeout(() => {
        const addedNode = document.querySelector(`tr[data-target-id="${id}"]`);
        if (addedNode && typeof gsap !== 'undefined') {
            gsap.fromTo(addedNode, { background: 'rgba(0, 240, 255, 0.25)' }, { background: 'transparent', duration: 1.5 });
        }
    }, 40);
});
function commitDeletion(targetID) {
    const structuralNode = document.querySelector(
        `tr[data-target-id="${targetID}"]`
    );

    if (structuralNode && typeof gsap !== 'undefined') {
        gsap.to(structuralNode, {
            x: -30,
            opacity: 0,
            duration: 0.35,
            onComplete: () => {
                studentDatabase = studentDatabase.filter(
                    item => item.id !== targetID
                );

                localStorage.setItem(
                    "students",
                    JSON.stringify(studentDatabase)
                );

                renderRoster();
            }
        });
    } else {
        studentDatabase = studentDatabase.filter(
            item => item.id !== targetID
        );

        localStorage.setItem(
            "students",
            JSON.stringify(studentDatabase)
        );

        renderRoster();
    }
}
rosterSearch.addEventListener('input', (event) => {
    const criticalQuery = event.target.value.toLowerCase();
    const matchedRecords = studentDatabase.filter(item =>
        item.name.toLowerCase().includes(criticalQuery) ||
        item.id.toLowerCase().includes(criticalQuery) ||
        item.email.toLowerCase().includes(criticalQuery)
    );
    renderRoster(matchedRecords);
});