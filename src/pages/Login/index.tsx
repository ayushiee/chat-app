import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Slide, toast, ToastContainer } from 'react-toastify';

import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';

import '../Signup/Signup.scss';
import 'react-toastify/dist/ReactToastify.css';

export default function Login(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await login(email, password);
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
        <h3>Log In</h3>
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
          <button type='submit' className='button' onClick={() => handleSubmit(email, password)} disabled={loading}>
            Log In
          </button>
        </div>
        Create a new account? <Link to={ROUTES.SIGNUP}>Sign Up </Link>
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
