import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';

import './Signup.scss';

export default function SignUp(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp } = useAuth();

  const handleSubmit = async (email: string, password: string, confirmPassword: string): Promise<void> => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
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
        {error && <span>{error}</span>}
        Already have an account? <Link to={ROUTES.LOGIN}>Login </Link>
      </div>
    </>
  );
}
