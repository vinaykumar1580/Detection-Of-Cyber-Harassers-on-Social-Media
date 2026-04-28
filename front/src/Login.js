import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Importing custom styles
// import Footer from './Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
    
        try {
            const response = await axios.post('http://localhost:3001/login', { email, password });
    
            if (response.data.success) {
                // Store user details in localStorage
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('name', response.data.name || "User"); // Ensure name is stored
    
                console.log("Login Success, User ID, Token & Name stored:", response.data.name);
    
                navigate('/admin/home'); // Redirect after login
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('Something went wrong. Please try again.');
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="text-center text-gradient">Welcome Back!</h2>
                <p className="text-center text-secondary">Please login to your account</p>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary w-100 py-2 btn-animate">
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p>Don&apos;t have an account?</p>
                    <Link to="/" className="btn btn-outline-primary w-100 py-2 btn-animate">
                        Register
                    </Link>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default Login;
