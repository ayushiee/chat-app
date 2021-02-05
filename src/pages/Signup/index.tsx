import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Slide, toast, ToastContainer } from 'react-toastify';

import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';

import './Signup.scss';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp } = useAuth();
  const history = useHistory();

  const handleSubmit = async (email: string, password: string, confirmPassword: string): Promise<void> => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      history.push(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='mainContainer'>
        <div>
          <img
            className='image'
            src='https://images.unsplash.com/photo-1567845735143-5e5d9d3f8f81?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
          />
        </div>
        <div className='rightBox'>
          <h1>Sign Up</h1>
          <div className='formBox'>
            <div className='itemRow'>
              <label className='inputLabel'> Email</label>
              <input
                type='text'
                className='input'
                required
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className='itemRow'>
              <label className='inputLabel'>Password</label>
              <input type='password' className='input' required onChange={e => setPassword(e.target.value)} />
            </div>
            <div className='itemRow'>
              <label className='inputLabel'> Confirm Password</label>
              <input type='password' className='input' required onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <button
              type='submit'
              className='button'
              onClick={() => handleSubmit(email, password, confirmPassword)}
              disabled={loading}
            >
              Sign up
            </button>
          </div>
          <div className='row'>
            Already have an account?{' '}
            <div className='text'>
              <Link to={ROUTES.LOGIN}> Login</Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position='bottom-right'
        autoClose={4000}
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
