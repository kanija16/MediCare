const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Fetch doctors from Backend and populate table OR dropdown
 */
async function fetchDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const doctors = await response.json();
        
        // Populate Doctors Table if it exists
        const tableBody = document.getElementById('doctors-table-body');
        if (tableBody) {
            tableBody.innerHTML = ''; // clear loading message
            
            if (doctors.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3">No doctors available.</td></tr>';
            } else {
                doctors.forEach(doc => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${doc.name}</td>
                        <td>${doc.specialty}</td>
                        <td>${doc.experience}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        }

        // Populate Appointment Dropdown if it exists
        const doctorSelect = document.getElementById('doctor_id');
        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Select a Doctor</option>';
            doctors.forEach(doc => {
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${doc.name} - ${doc.specialty}`;
                doctorSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error fetching doctors: ", error);
        
        const tableBody = document.getElementById('doctors-table-body');
        if (tableBody) {
             tableBody.innerHTML = '<tr><td colspan="3" style="color:red;">Failed to loading doctors data. Ensure backend is running.</td></tr>';
        }
    }
}

/**
 * Handle Patient Registration
 */
function handleRegistration(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Basic Form Validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert("Please fill out all required fields.");
        return;
    }

    const payload = { name, email, phone, password };

    fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(result => {
        if (result.status === 200 || result.status === 201) {
            alert("Registration successful! You can now book an appointment.");
            window.location.href = "appointment.html";
        } else {
            alert("Error: " + (result.body.detail || "Registration failed"));
        }
    })
    .catch(err => {
        console.error("Registration failed", err);
        alert("Registration failed due to a network error.");
    });
}

/**
 * Handle Appointment Booking
 */
function handleAppointment(event) {
    event.preventDefault();

    const patient_name = document.getElementById('patient_name').value.trim();
    const doctor_id = document.getElementById('doctor_id').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (!patient_name || !doctor_id || !date || !time) {
        alert("Please fill all fields to book.");
        return;
    }

    const payload = { 
        patient_name: patient_name,
        doctor_id: parseInt(doctor_id),
        date: date,
        time: time
    };

    fetch(`${API_BASE_URL}/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(result => {
        if (result.status === 200 || result.status === 201) {
            alert("Appointment Booked Successfully!");
            document.getElementById('appointmentForm').reset();
        } else {
            alert("Error: " + (result.body.detail || "Failed to book"));
        }
    })
    .catch(err => {
        console.error("Booking failed", err);
        alert("Booking failed due to network error.");
    });
}

// Set up event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Highlight active nav link
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentLocation) {
            link.classList.add('active');
        }
    });

    // If we're on a page that needs the doctor list, fetch it
    if (document.getElementById('doctors-table-body') || document.getElementById('doctor_id')) {
        fetchDoctors();
    }

    // Attach form submission handlers
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', handleRegistration);
    }

    const apptForm = document.getElementById('appointmentForm');
    if (apptForm) {
        apptForm.addEventListener('submit', handleAppointment);
    }
});
