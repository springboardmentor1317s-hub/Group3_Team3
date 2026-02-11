  import { useForm } from 'react-hook-form';
  import { Link , useNavigate} from 'react-router';
  import { useState } from 'react';
  // import studentService from '../../services/student.service.js'; // Make sure to import the service
  import { useDispatch } from 'react-redux'
  import {login,logout } from '../../store/features/trackAuthSlice.js'

 function RegisterPage() {
     const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // later: call backend; now just go to login
    navigate("/login");
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join CampusEventHub today</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <label>Email Address</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <label>College/University</label>
          <input
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="Enter your college name"
          />

          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="college_admin">College Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">Create Account</button>
        </form>

        <p style={{ marginTop: "1rem" }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
export default RegisterPage;
