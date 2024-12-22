class StudentSystem {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.form = document.getElementById('studentForm');
        this.studentList = document.getElementById('studentList');
        this.imagePreview = document.getElementById('preview');
        this.imageInput = document.getElementById('studentImage');
        
        this.initializeEventListeners();
        this.setupImagePreview();
        this.displayStudents();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStudent();
        });

        // Add automatic attendance calculation
        const presentInput = document.getElementById('attendancePresent');
        const absentInput = document.getElementById('attendanceAbsent');

        presentInput.addEventListener('input', () => {
            const present = parseInt(presentInput.value) || 0;
            if (present <= 100) {
                absentInput.value = 100 - present;
            }
        });

        absentInput.addEventListener('input', () => {
            const absent = parseInt(absentInput.value) || 0;
            if (absent <= 100) {
                presentInput.value = 100 - absent;
            }
        });
    }

    setupImagePreview() {
        this.imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addStudent() {
        const imageData = this.imagePreview.src;
        
        // Get SGPA values
        const sgpaValues = [
            parseFloat(document.getElementById('sgpa1').value),
            parseFloat(document.getElementById('sgpa2').value),
            parseFloat(document.getElementById('sgpa3').value),
            parseFloat(document.getElementById('sgpa4').value)
        ];

        // Calculate CGPA as average of SGPAs
        const cgpaValues = [];
        let sum = 0;
        sgpaValues.forEach((sgpa, index) => {
            sum += sgpa;
            cgpaValues.push(parseFloat((sum / (index + 1)).toFixed(2)));
        });

        const student = {
            rollNo: document.getElementById('rollNo').value,
            fullName: document.getElementById('fullName').value,
            class: document.getElementById('class').value,
            birthDate: document.getElementById('birthDate').value,
            address: document.getElementById('address').value,
            contact: document.getElementById('contact').value,
            image: imageData,
            attendance: {
                present: parseInt(document.getElementById('attendancePresent').value),
                absent: parseInt(document.getElementById('attendanceAbsent').value)
            },
            academics: {
                sgpa: sgpaValues,
                cgpa: cgpaValues
            }
        };

        if (this.validateStudent(student)) {
            this.students.push(student);
            this.saveToLocalStorage();
            this.displayStudents();
            this.form.reset();
            this.imagePreview.src = 'placeholder.png';
        }
    }

    validateStudent(student) {
        if (!student.image || student.image === 'placeholder.png') {
            alert('Please upload a student photo');
            return false;
        }

        if (!student.rollNo || !student.fullName || !student.class || 
            !student.birthDate || !student.address || !student.contact) {
            alert('Please fill all fields');
            return false;
        }
        
        // Validate attendance
        if (student.attendance.present + student.attendance.absent !== 100) {
            alert('Total attendance percentage must equal 100%');
            return false;
        }

        // Validate SGPA values
        if (student.academics.sgpa.some(sgpa => sgpa < 0 || sgpa > 10 || isNaN(sgpa))) {
            alert('SGPA values must be between 0 and 10');
            return false;
        }
        
        if (this.students.some(s => s.rollNo === student.rollNo)) {
            alert('Roll number already exists');
            return false;
        }

        return true;
    }

    displayStudents() {
        this.studentList.innerHTML = '';
        this.students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border">
                    <img src="${student.image}" alt="${student.fullName}" 
                        class="h-12 w-12 object-cover rounded-full">
                </td>
                <td class="py-2 px-4 border">${student.rollNo}</td>
                <td class="py-2 px-4 border">${student.fullName}</td>
                <td class="py-2 px-4 border">${student.class}</td>
                <td class="py-2 px-4 border">${student.birthDate}</td>
                <td class="py-2 px-4 border">${student.address}</td>
                <td class="py-2 px-4 border">${student.contact}</td>
                <td class="py-2 px-4 border flex gap-2">
                    <button onclick="studentSystem.viewStudent('${student.rollNo}')" 
                            class="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">
                        View
                    </button>
                    <button onclick="studentSystem.deleteStudent('${student.rollNo}')" 
                            class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
                        Delete
                    </button>
                </td>
            `;
            this.studentList.appendChild(row);
        });
    }

    deleteStudent(rollNo) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.students = this.students.filter(student => student.rollNo !== rollNo);
            this.saveToLocalStorage();
            this.displayStudents();
        }
    }

    viewStudent(rollNo) {
        const student = this.students.find(s => s.rollNo === rollNo);
        if (student) {
            localStorage.setItem('viewStudent', JSON.stringify(student));
            window.location.href = 'student-view.html';
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }
}

// Initialize the student system
const studentSystem = new StudentSystem();
