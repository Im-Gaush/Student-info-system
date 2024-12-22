document.addEventListener('DOMContentLoaded', () => {
    const student = JSON.parse(localStorage.getItem('viewStudent'));
    if (!student) {
        window.location.href = 'index.html';
        return;
    }

    // Populate student information
    document.getElementById('studentImage').src = student.image;
    document.getElementById('studentName').textContent = student.fullName;
    document.getElementById('rollNo').textContent = student.rollNo;
    document.getElementById('class').textContent = student.class;
    document.getElementById('birthDate').textContent = student.birthDate;
    document.getElementById('address').textContent = student.address;
    document.getElementById('contact').textContent = student.contact;

    // Sample data for attendance chart
    const attendanceData = {
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [student.attendance.present, student.attendance.absent],
            backgroundColor: ['#4CAF50', '#FF5252'],
            borderWidth: 0
        }]
    };

    // Sample data for performance chart
    const performanceData = {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        datasets: [
            {
                label: 'SGPA',
                data: student.academics.sgpa,
                borderColor: '#2196F3',
                tension: 0.1,
                fill: false
            },
            {
                label: 'CGPA',
                data: student.academics.cgpa,
                borderColor: '#FF9800',
                tension: 0.1,
                fill: false
            }
        ]
    };

    // Create attendance pie chart
    new Chart(document.getElementById('attendanceChart'), {
        type: 'pie',
        data: attendanceData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Create performance line chart
    new Chart(document.getElementById('performanceChart'), {
        type: 'line',
        data: performanceData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 10
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}); 