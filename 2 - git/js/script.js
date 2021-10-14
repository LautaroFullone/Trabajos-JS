const apiUrl = 'https://utn-avanzada2-primerparcial.herokuapp.com/api'

function get(url) {
    const request = new XMLHttpRequest()
    request.responseType = 'json'
    return new Promise((resolve, reject) => {
        request.open('GET', url)
        request.onload = () => {
            if (request.status == 200 ) {
                resolve(request.response)
            } else {
                reject(request.statusText)
            }
        }
        request.onerror = () => reject(request.statusText)
        request.send()
    })
}lo

function remove(url) {
    const request = new XMLHttpRequest()
    request.responseType = 'json'
    return new Promise((resolve, reject) => {
        request.open('DELETE', url)
        request.onload = () => {
            if (request.status == 200 ) {
                resolve(request.response)
            } else {
                reject(request.statusText)
            }
        }
        request.onerror = () => reject(request.statusText)
        request.send()
    })
}

function getStudents() {
    return get(`${apiUrl}/student`)
}

function getCareers() {
    return get(`${apiUrl}/career`)
}

function deleteStudent(id){
    return remove(`${apiUrl}/student/`+id);
}

function sortStudentsByLastName(prevStudent, nextStudent) {
    if(prevStudent.lastName < nextStudent.lastName) { return -1; }
    if(prevStudent.lastName > nextStudent.lastName) { return 1; }
    return 0;
}

const State = (function () {
    let instance; 

    async function createState(params) {
        const students = await getStudents() || [];
        const careers = await getCareers() || [];

        return {
            students: students.sort(sortStudentsByLastName),
            careers
        }
    }

    return {
        async get(name) {
            if (!instance) {
                instance = await createState();
            }
            return name ? instance[name] : instance;
        },
        async update () {
            const students = await getStudents() || [];
            instance = instance || {};
            instance.students = students.sort(sortStudentsByLastName);
        }
    }
    
})()

async function renderTable() {

    const students = await State.get('students') || [];
    const careers = await State.get('careers') || [];

    const table = document.getElementById("table").getElementsByTagName('tbody')[0]
    while (table.firstChild) table.removeChild(table.firstChild)
    students.forEach(student => {

        const career = careers.find(c => student.careerId === c.careerId && c.active);

        if(!career) return;
        
        const row = table.insertRow(-1)

        const studentId = row.insertCell(-1)
        studentId.innerHTML = student.studentId

        const careerName = row.insertCell(-1)
        careerName.innerHTML = career.name

        const firstName = row.insertCell(-1)
        firstName.innerHTML = student.firstName

        const lastName = row.insertCell(-1)
        lastName.innerHTML = student.lastName

        const email = row.insertCell(-1)
        email.innerHTML = student.email

        const deleteModal = "#deleteStudentModal";

        const deleteLink = document.createElement("a");
        deleteLink.innerHTML = `
            <i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
        `;
        deleteLink.className = "delete";
        deleteLink.href = deleteModal
        deleteLink.dataset.toggle = "modal";

        deleteLink.addEventListener('click', (e) => {
            async function submit (e) {
                e.preventDefault();
                document.querySelector(`${deleteModal} form`).removeEventListener('submit', submit);
                $(deleteModal).modal('hide');
                await deleteStudent(student.studentId);
                await State.update();
                const state = await State.get();
                renderTable(state.students, state.careers);
            }

            document.querySelector(`${deleteModal} form`).addEventListener('submit', submit);
            $(deleteModal).on('hide.bs.modal', e => {
                document.querySelector(`${deleteModal} form`).removeEventListener('submit', submit);
            })
        });
        
        const deleteButton = row.insertCell(-1);
        deleteButton.appendChild(deleteLink);
    })
}


window.onload = async () => {

    await renderTable();
}