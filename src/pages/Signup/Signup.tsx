import React, { useState } from 'react';

import { useAuth } from '../../utils/auth';

import './Signup.scss';

export default function SignUp(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp, currentUser } = useAuth();

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

  console.log(JSON.stringify(currentUser, null, 2));

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
          <button type='submit' onClick={() => handleSubmit(email, password, confirmPassword)} disabled={loading}>
            Sign up
          </button>
          {error && <span>{error}</span>}
          <button type='submit' onClick={() => console.log('login')}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
