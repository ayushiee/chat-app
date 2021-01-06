import React, { useState } from 'react';
import './Login.scss';

export default function Login(): React.ReactElement<{}> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log(email);

  return (
    <>
      <div className='mainContainer'>
        <h3>Login</h3>
        <div className='content'>
          <div className='item-row'>
            Email
            <input type='text' className='input' value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className='item-row'>
            Password
            <input type='password' className='input' value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
      </div>
    </>
  );
}
