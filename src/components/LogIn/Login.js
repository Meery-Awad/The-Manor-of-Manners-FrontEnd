import React, { useState, useEffect } from 'react';
import './Login.scss';
import { useBetween } from 'use-between';
import { useSelector } from 'react-redux';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import icon from '../../images/icon.png';
import axios from 'axios';

const LoginPage = () => {
  const state = useSelector((state) => state.data);
  const { userDetails, setUserDetails, Loading, setLoading, updatedData, setUpdatedData } =
    useBetween(state.useShareState);
  const { email, password, confirmPassword } = userDetails;
  const [erorr, setErorr] = useState('');

  // حالة إظهار/إخفاء الباسوورد
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname.toLowerCase().includes('register');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErorr('');
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails((prev) => ({
          ...prev,
          img: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const headers = { 'content-type': 'application/json;charset=UTF-8' };

    if (isRegister) {
      axios
        .post('http://localhost:5000/api/users/register', userDetails, { headers })
        .then((res) => {
          console.log('user registered success');
          setLoading(false);
          navigate('/Login');
        })
        .catch((err) => {
          setErorr(err.response?.data?.message);
          console.error('Error:', err.response?.data);
          setLoading(false);
        });
    } else {
      axios
        .post('http://localhost:5000/api/users/login', { email, password }, { headers })
        .then((res) => {
          console.log('User data:', res.data);
          const newUser = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            password: res.data.password,
            img: res.data.img || icon,
            courses: res.data.courses,
          };
          
          setUpdatedData(newUser);
          setUserDetails(newUser);
          
          setLoading(false);
          localStorage.setItem('user', JSON.stringify(newUser));
          navigate('/Home');
        })
        .catch((err) => {
          setErorr(err.response?.data?.message);
          console.error('Login error:', err.response?.data);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setUserDetails({
      id: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      img: '',
      courses: [],
    });
    setErorr('');
  }, [location]);

  return (
    <div className="login-page">
      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {erorr && <div style={{ color: 'red' }}>{erorr}</div>}

            {isRegister && (
              <>
                <label>
                  Full Name <span className="required"> *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name || ''}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </>
            )}

            <label>
              Email <span className="required"> *</span>
            </label>
            <input
              type="email"
              name="email"
              value={userDetails.email || ''}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />

            <label>
              Password <span className="required"> *</span>
            </label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={userDetails.password || ''}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              <i
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {isRegister && (
              <>
                <label>
                  Confirm Password <span className="required"> *</span>
                </label>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={userDetails.confirmPassword || ''}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                  />
                  <i
                    className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  ></i>
                </div>

                <label>
                  Upload Image <span className="description">(optional)</span>
                </label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {userDetails.img && (
                  <div className="img">
                    <img src={userDetails.img} alt="Preview" />
                  </div>
                )}
              </>
            )}
          </div>

          <button type="submit" className="login-btn">
            {isRegister ? 'Register' : 'Login'}
          </button>

          {!isRegister && (
            <p className="text-center mt-4">
              Don't have an account?{' '}
              <NavLink to="/Register" className="text-600 underline" style={{ color: '#2a143d' }}>
                Register here
              </NavLink>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
