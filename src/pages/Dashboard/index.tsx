import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import firebase from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { firestore } from '../../utils/firebase';
import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';

import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.scss';

export default function ChatDashboard(): React.ReactElement {
  const { logout, currentUser } = useAuth();
  const history = useHistory();
  const messageRef: firebase.firestore.DocumentData = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [message] = useCollectionData(query, { idField: 'id' });

  const [msg, setMsg] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      history.push(ROUTES.LOGIN);
      toast('Successfully Logged out.');
    } catch (error) {
      toast.error(error.message);
    }
  };
  // set messages in array
  // firestore.collection('messages')
  //   .orderBy('createdAt').limit(25)
  //   .onSnapshot((querySnapshot) => {
  //     const allMessages = []
  //     querySnapshot.forEach((doc) => {
  //       if (doc) allMessages.push(doc.data())
  //     })

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const send = await messageRef.add({
      text: msg.trim(),
      createdAt: firebase.firestore.Timestamp.now(),
      uid: currentUser?.uid
    });

    setMsg('');
  };

  console.log(JSON.stringify(currentUser, null, 2));
  return (
    <>
      <div className='main'>
        <h2>Chat Dashboard</h2>
        <form onSubmit={sendMessage}>
          <input
            type='text'
            className='type-message'
            placeholder='Type your message here'
            onChange={e => {
              setMsg(e.target.value);
            }}
            value={msg}
          />
          {/* {message} */}
          <button type='submit' disabled={!msg}>
            Send
          </button>
        </form>
        <button type='button' onClick={() => handleLogout()}>
          Log out
        </button>
      </div>
    </>
  );
}

function MessageBubble(props: any): React.ReactElement {
  const [text, id, photoURL] = props.message;
  const { currentUser } = useAuth();
  const messageClass = id === currentUser?.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <p>{text}</p>
      </div>
    </>
  );
}
