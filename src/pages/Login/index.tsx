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
        <div>
          <img
            className='image'
            src='https://firebasestorage.googleapis.com/v0/b/chat-app-4081a.appspot.com/o/asset%2Flog-in.png?alt=media&token=0472c764-a3f7-448f-bb82-8d950bad49d6'
          />
        </div>
        <div className='rightBox'>
          <h1>Login</h1>
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
            <button type='submit' className='button' onClick={() => handleSubmit(email, password)} disabled={loading}>
              Login
            </button>
          </div>
          <div className='row'>
            Don&apos;t have an account?{' '}
            <div className='text'>
              <Link to={ROUTES.SIGNUP}> Signup</Link>
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
