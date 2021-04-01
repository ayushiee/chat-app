import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

import { createMessage } from '../../context/collectionMethods';
import { firestore } from '../../utils/firebase';
import { useAuth } from '../../context/auth';
import { MessageBubble } from '../index';
import Chat from '../../assets/Chat.svg';

import './ChatWindow.scss';

interface ChatWindow {
  activeUser: firebase.firestore.DocumentData | undefined;
  activeGroup: string | undefined;
}

export default function ChatWindow(props: ChatWindow): React.ReactElement {
  const { activeUser, activeGroup } = props;
  const { currentUser } = useAuth();
  const [msg, setMsg] = useState('');
  const [text, setText] = useState<firebase.firestore.DocumentData>([]);
  console.log(activeGroup);
  // TODO: Then fetch msgs between them by fetching msg id from groups.msgs[] and then fetch msg text through ids.

  const sendMessage = async (e: any) => {
    e.preventDefault();

    const message = createMessage(msg.trim(), currentUser?.uid, activeGroup);

    await firestore.collection('messages').doc(message.id).set(message);

    setMsg('');
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
            ...doc.data()
          });
        });
        setText(docs);
      });

    return message;
  }, []);

  return (
    <div className='chatContainer'>
      {activeUser ? (
        <>
          {' '}
          <div className='userInfo'>
            <h2>{activeUser?.email}</h2>
            <h2>hehehh</h2>
          </div>
          <div>
            <div className='texts'>
              {text &&
                text.map((item: firebase.firestore.DocumentData) => <MessageBubble key={item.id} message={item} />)}
            </div>
            <div className='inputTexts'>
              <form onSubmit={sendMessage}>
                <input
                  type='text'
                  className='messageInput'
                  placeholder='Type your message here'
                  onChange={e => {
                    setMsg(e.target.value);
                  }}
                  value={msg}
                />
                <button type='submit' disabled={!msg || msg.trim().length === 0}>
                  Send
                </button>
              </form>

              {/* <MessageInput onSend={onSend} /> */}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='noChat'>
            <img src={Chat} alt='Let us talk' className='altImage' />
            <h2>Let&#39;s start messaging!</h2>
          </div>
        </>
      )}
    </div>
  );
}
