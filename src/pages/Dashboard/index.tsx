import React from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';

import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.scss';

export default function Home(): React.ReactElement {
  const { logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push(ROUTES.LOGIN);
      toast('Successfully Logged out.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className='main'>
        <h2>Chat Dashboard</h2>
        <button type='button' onClick={() => handleLogout()}>
          Log out
        </button>
      </div>
    </>
  );
}
