import React, { useState, useRef } from 'react';
import './Signup.scss';
import { useAuth } from '../../utils/auth';

export default function SignUp() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (passwordRef?.current?.value !== passwordConfirmRef?.current?.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signUp(emailRef?.current?.value, passwordRef?.current?.value);
    } catch {
      setError('Failed to create an account');
    }

    setLoading(false);
  };

  return (
    <>
      <div className='mainContainer'>
        <h3>Sign Up</h3>
        {error && alert(error)}
        <div className='content'>
          <div className='item-row'>
            Email
            <input type='text' className='input' ref={emailRef} required />
          </div>
          <div className='item-row'>
            Password
            <input type='password' className='input' ref={passwordRef} required />
          </div>
          <div className='item-row'>
            Confirm Password
            <input type='password' className='input' ref={passwordConfirmRef} required />
          </div>
          <button type='button' onSubmit={handleSubmit} disabled={loading} onClick={() => console.log('sign up')}>
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
