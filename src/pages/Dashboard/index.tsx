import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import firebase from 'firebase';

import { firestore } from '../../utils/firebase';
import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';

import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.scss';

export default function ChatDashboard(): React.ReactElement {
  const { logout, currentUser } = useAuth();
  const history = useHistory();
  const messageRef: firebase.firestore.DocumentData = firestore.collection('messages');
  const [msg, setMsg] = useState('');
  const [text, setText] = useState<firebase.firestore.DocumentData>([]);

  const handleLogout = async () => {
    try {
      await logout();
      history.push(ROUTES.LOGIN);
      toast('Successfully Logged out.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const message = firestore
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .limit(25)
      .onSnapshot(snapshot => {
        const docs: firebase.firestore.DocumentData = [];
        snapshot.forEach(doc => {
          docs.push({
            ...doc.data(),
            id: doc.id
          });
        });
        setText(docs);
      });

    return message;
  }, []);

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
          <button type='submit' disabled={!msg}>
            Send
          </button>
        </form>
        {/* {text && text.map((item: firebase.firestore.DocumentData) => <MessageBubble key={item.id} message={item} />)} */}
        <button type='button' onClick={() => handleLogout()}>
          Log out
        </button>
      </div>
    </>
  );
}

function MessageBubble({ message }: { message: firebase.firestore.DocumentData }): React.ReactElement {
  const { text, uid } = message;
  const { currentUser } = useAuth();
  const messageClass = uid === currentUser?.uid ? 'sent' : 'received';
  return (
    <>
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    </>
  );
}
