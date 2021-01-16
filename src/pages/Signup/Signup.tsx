import React, { useEffect, useState } from 'react';
import './Signup.scss';
import { useAuth } from '../../utils/auth';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [, setLoading] = useState<boolean>(false);
  const { signUp, currentUser } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signUp(email, password);
    } catch {
      setError('Failed to create an account');
    }
    setLoading(false);
  };

  return (
    <>
      <div className='mainContainer'>
        {console.log('user: ', currentUser)}
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
            onClick={e => {
              console.log('form: ', e);
              handleSubmit(e);
            }}
          >
            {/* disabled={loading}> */}
            Sign up
          </button>

          <button type='submit' onClick={() => console.log('login')}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
