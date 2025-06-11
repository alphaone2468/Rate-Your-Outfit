import React, { useState } from 'react';
import '../css/Signup.css';

export default function SignUp() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!userName.trim()) {
      newErrors.userName = 'Username is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Proceed with signup logic
      
    }
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleSubmit} className="loginElementsContainer">
        <div className="usernameContainer">
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            className="usernameInput"
            placeholder="alpha"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {errors.userName && <span className="error">{errors.userName}</span>}
        </div>

        <div className="emailContainer">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            className="emailInput"
            placeholder="alpha@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="passwordContainer">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="passwordInput"
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="loginBtnContainer">
          <button className="loginBtn" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
