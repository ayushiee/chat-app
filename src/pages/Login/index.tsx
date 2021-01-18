import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';

import '../Signup/Signup.scss';

export default function Login(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleSubmit = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await login(email, password);
      //TODO: handle routing here
    } catch (error) {
      setError(error.message);
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
        {error && <span>{error}</span>}
        Create a new account? <Link to={ROUTES.SIGNUP}>Sign Up </Link>
      </div>
    </>
  );
}
