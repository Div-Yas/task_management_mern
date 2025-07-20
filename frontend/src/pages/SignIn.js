import React, { useState } from 'react';
import styles from './SignUp.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants';

const SignIn = () => {
  // Form state
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  // Validation function
  const validate = () => {
    const errs = {};
    if (!form.email) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    return errs;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setApiError(data.errors?.[0]?.msg || 'Login failed');
        } else {
          localStorage.setItem('token', data.data.token);
          navigate('/tasks');
        }
      } catch (err) {
        setApiError('Server error');
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Ellipse Images using MUI Box */}
      <Box 
        component="img" 
        src={process.env.PUBLIC_URL + '/Ellipse1.png'} 
        alt="ellipse1" 
        className={styles.ellipse1} 
      />
      <Box 
        component="img" 
        src={process.env.PUBLIC_URL + '/Ellipse2.png'} 
        alt="ellipse2" 
        className={styles.ellipse2} 
      />
      <Box 
        component="img" 
        src={process.env.PUBLIC_URL + '/Ellipse3.png'} 
        alt="ellipse3" 
        className={styles.ellipse3} 
      />
      
      {/* Left Section */}
      <div className={styles.leftSection}>
        <Box 
          component="img" 
          src={process.env.PUBLIC_URL + '/logo.png'} 
          alt="Lemonpay Logo" 
          className={styles.logo} 
        />
        <div className={styles.leftContent}>
          <h1 className={styles.leftTitle}>
            Join 1000 Businesses<br />
            <span className={styles.yellowText}>Powering Growth with</span>
            <br />Lemonpay!
          </h1>
        </div>
      </div>
      
      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome Login System</h2>
            <p className={styles.formSubtitle}>
              Your gateway to seamless<br />transactions and easy payments.
            </p>
          </div>
          <Box component="form" className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Email</label>
              <TextField
                name="email"
                placeholder="john@lemonpay.com"
                variant="outlined"
                fullWidth
                size="small"
                className={styles.textField}
                value={form.email}
                onChange={handleChange}
                error={!!errors.email && submitted}
                InputProps={{
                  sx: {
                    background: '#E6E1FAA3',
                    borderRadius: '8px',
                    border: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& input': {
                      color: '#fff',
                      fontSize: '14px',
                      padding: '12px 16px',
                    },
                    '& input::placeholder': {
                      color: '#fff',
                      opacity: 0.7,
                    },
                  },
                }}
              />
              {errors.email && submitted && (
                <span style={{ color: '#FF6B6B', fontSize: 13, marginTop: 2 }}>{errors.email}</span>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Password</label>
              <TextField
                name="password"
                placeholder="Min 8 characters"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                className={styles.textField}
                value={form.password}
                onChange={handleChange}
                error={!!errors.password && submitted}
                InputProps={{
                  sx: {
                    background: '#E6E1FAA3',
                    borderRadius: '8px',
                    border: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& input': {
                      color: '#fff',
                      fontSize: '14px',
                      padding: '12px 16px',
                    },
                    '& input::placeholder': {
                      color: '#fff',
                      opacity: 0.7,
                    },
                  },
                }}
              />
              {errors.password && submitted && (
                <span style={{ color: '#FF6B6B', fontSize: 13, marginTop: 2 }}>{errors.password}</span>
              )}
            </div>
            {apiError && <div style={{ color: '#FF6B6B', marginBottom: 8 }}>{apiError}</div>}
            <Box className={styles.formOptions}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-checked': {
                        color: '#fff',
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 18,
                      },
                    }}
                  />
                }
                label={<span className={styles.checkboxLabel}>Remember me</span>}
                className={styles.rememberMe}
              />
              <Button
                component={Link}
                to="/signup"
                className={styles.signUpLink}
              >
                Sign Up
              </Button>
            </Box>
            <Button
              variant="contained"
              fullWidth
              className={styles.signInButton}
              type="submit"
            >
              Sign In
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default SignIn;