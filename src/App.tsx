import React from 'react';

import SignUp from './pages/Signup/Signup';
import './App.scss';
import { AuthProvider } from './utils/auth';

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <SignUp />
      </div>
    </AuthProvider>
  );
}

export default App;
