import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const handleSubmit = async (email: string, password: string, confirmPassword: string): Promise<void> => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      //TODO: handle routing here
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='mainContainer'>
        <h3>Sign Up</h3>
        <div className='content'>
          <div className='item-row'>
            Email
            <input
              type='text'
              className='input'
              required
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className='item-row'>
            Password
            <input type='password' className='input' required onChange={e => setPassword(e.target.value)} />
          </div>
          <div className='item-row'>
            Confirm Password
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
        Already have an account? <Link to={ROUTES.LOGIN}>Login </Link>
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
