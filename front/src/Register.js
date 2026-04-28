import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Importing custom styles for animations and additional design

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Password validation function
    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const upperCase = /[A-Z]/;
        const lowerCase = /[a-z]/;
        const digit = /\d/;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

        if (!minLength.test(password)) {
            alert("Password must be at least 8 characters long.");
            return false;
        }
        if (!upperCase.test(password)) {
            alert("Password must contain at least one uppercase letter.");
            return false;
        }
        if (!lowerCase.test(password)) {
            alert("Password must contain at least one lowercase letter.");
            return false;
        }
        if (!digit.test(password)) {
            alert("Password must contain at least one number.");
            return false;
        }
        if (!specialChar.test(password)) {
            alert("Password must contain at least one special character.");
            return false;
        }
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validatePassword(password)) {
            return;
        }

        axios.post('http://localhost:3001/register', { name, email, password })
            .then(result => {
                console.log(result);
                if (result.data === "Already registered") {
                    alert("E-mail already registered! Please Login to proceed.");
                    navigate('/login');
                } else {
                    alert("Registered successfully! Please Login to proceed.");
                    navigate('/login');
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div style={{marginTop:"-50px"}} className="register-container d-flex justify-content-center mt-20 align-items-center vh-100">
            <div className="register-card p-4 rounded mt-10 shadow-lg">
                <h2 className="text-center text-gradient fw-bold mb-4">Create Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label htmlFor="name" className="form-label fw-bold">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="form-control input-style"
                            id="name"
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="form-control input-style"
                            id="email"
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="password" className="form-label fw-bold">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="form-control input-style"
                            id="password"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 btn-animate">
                        Register
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-outline-primary w-100 fw-bold py-2 btn-animate">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
