const { useState, useEffect } = React;
const { HashRouter, Routes, Route, Link, useNavigate, useLocation } = ReactRouterDOM;

const API_BASE_URL = 'http://127.0.0.1:8000';

// ===== COMPONENTS =====

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';
  
    return (
      <header>
        <nav>
          <Link to="/" className="logo">MediCare (React)</Link>
          <ul className="nav-links">
            <li><Link to="/" className={isActive('/')}>Home</Link></li>
            <li><Link to="/about" className={isActive('/about')}>About</Link></li>
            <li><Link to="/doctors" className={isActive('/doctors')}>Doctors</Link></li>
            <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
            <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
            <li><Link to="/register" className="btn-primary">Register</Link></li>
          </ul>
        </nav>
      </header>
    );
};

const Footer = () => (
    <footer>
        <p>&copy; 2026 MediCare Hospital. All Rights Reserved. (React App)</p>
    </footer>
);

const Home = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Caring for Life</h1>
                <p>Leading the way in medical excellence. Your health is our priority.</p>
                <Link to="/appointment" className="btn-primary">Book an Appointment</Link>
            </div>
        </section>
    );
};

const About = () => (
    <section className="page-section">
        <h2 className="section-title">About MediCare</h2>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
            <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80" alt="Hospital Building" style={{width: '100%', borderRadius: '10px', marginBottom: '2rem'}} />
            <p style={{fontSize: '1.1rem', color: '#555', marginBottom: '1rem'}}>
                MediCare is a state-of-the-art medical facility dedicated to providing top-quality healthcare to our community.
            </p>
        </div>
    </section>
);

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/doctors`)
            .then(res => res.json())
            .then(data => {
                setDoctors(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <section className="page-section">
            <h2 className="section-title">Our Expert Doctors</h2>
            <div style={{maxWidth: '900px', margin: '0 auto'}}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Specialty</th>
                            <th>Experience</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan="3" style={{textAlign:'center'}}>Loading...</td></tr>}
                        {!loading && doctors.length === 0 && <tr><td colSpan="3" style={{textAlign:'center'}}>No doctors found.</td></tr>}
                        {!loading && doctors.map(doc => (
                            <tr key={doc.id}>
                                <td>{doc.name}</td>
                                <td>{doc.specialty}</td>
                                <td>{doc.experience}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

const Services = () => (
    <section className="page-section">
        <h2 className="section-title">Hospital Facilities</h2>
        <div className="grid-container" style={{maxWidth: '1000px', margin: '0 auto'}}>
            <div className="card">
                <img src="https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?auto=format&fit=crop&q=80" alt="Cardiology" style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px'}}/>
                <h3>Cardiology</h3>
                <p>State-of-the-art heart care and diagnostics.</p>
            </div>
            <div className="card">
                <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80" alt="Neurology" style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px'}}/>
                <h3>Neurology</h3>
                <p>Expert care for brain and nervous system disorders.</p>
            </div>
            <div className="card">
                <img src="https://images.unsplash.com/photo-1551076805-e1869043e560?auto=format&fit=crop&q=80" alt="Laboratory" style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px'}}/>
                <h3>24/7 Laboratory</h3>
                <p>Quick and accurate test results round the clock.</p>
            </div>
        </div>
    </section>
);

const Contact = () => (
    <section className="page-section">
        <h2 className="section-title">Contact Us</h2>
        <div style={{maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            <div className="card" style={{textAlign: 'left'}}>
                <h3 style={{marginTop: '0'}}>Hospital Address</h3>
                <p><strong>Location:</strong> 123 Health Avenue, Medical District</p>
                <p><strong>City:</strong> New York, NY 10001</p>
                <p><strong>Email:</strong> support@medicare.com</p>
                <p><strong>Phone:</strong> +1 (800) 123-4567</p>
            </div>
            <div>
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617355914619!2d-73.98785312349756!3d40.74844443538418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1714489814321!5m2!1sen!2sus" width="100%" height="400" style={{border:0, borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} allowFullScreen="" loading="lazy"></iframe>
            </div>
        </div>
    </section>
);

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', gender: '' });

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert("Registration successful!");
                navigate('/appointment');
            } else {
                alert("Error: " + (data.detail || "Registration failed"));
            }
        } catch (error) {
            alert("Network error.");
        }
    };

    return (
        <section className="page-section">
            <h2 className="section-title">Patient Registration</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Gender:</label>
                        <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem'}}>
                            <label style={{fontWeight: 'normal'}}><input type="radio" name="gender" value="male" onChange={handleChange} required /> Male</label>
                            <label style={{fontWeight: 'normal'}}><input type="radio" name="gender" value="female" onChange={handleChange} /> Female</label>
                            <label style={{fontWeight: 'normal'}}><input type="radio" name="gender" value="other" onChange={handleChange} /> Other</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{width: '100%'}}>Create Account</button>
                </form>
            </div>
        </section>
    );
};

const Appointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({ patient_name: '', doctor_id: '', date: '', time: '' });

    useEffect(() => {
        fetch(`${API_BASE_URL}/doctors`).then(res => res.json()).then(setDoctors).catch(console.error);
    }, []);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...formData, doctor_id: formData.doctor_id})
            });
            const data = await res.json();
            if (res.ok) {
                alert("Appointment Booked Successfully!");
                setFormData({ patient_name: '', doctor_id: '', date: '', time: '' });
            } else {
                alert("Error: " + (data.detail || "Failed to book"));
            }
        } catch (error) {
            alert("Network error.");
        }
    };

    return (
        <section className="page-section">
            <h2 className="section-title">Book an Appointment</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input type="text" name="patient_name" value={formData.patient_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Select Doctor</label>
                        <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required>
                            <option value="">Select a Doctor</option>
                            {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Preferred Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Preferred Time</label>
                        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Additional Notes</label>
                        <textarea rows="4" placeholder="Describe symptoms..."></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{width: '100%'}}>Confirm Booking</button>
                </form>
            </div>
        </section>
    );
};

// Main App Component
const App = () => {
  return (
    <HashRouter>
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/appointment" element={<Appointment />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
