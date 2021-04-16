import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { IoIosSend, IoIosCall, IoIosVideocam, IoMdMore } from 'react-icons/io';

import { createMessage } from '../../context/collectionMethods';
import { firestore, DocumentData, UnsubscribeFn } from '../../utils/firebase';
import { useAuth } from '../../context/auth';
import { MessageBubble } from '../index';

import Chat from '../../assets/Chat.svg';
import './ChatWindow.scss';

interface ChatWindowProps {
  activeUser: DocumentData | undefined;
  activeGroup: string | undefined;
}

export default function ChatWindow(props: ChatWindowProps): React.ReactElement {
  const { activeUser, activeGroup } = props;
  const { currentUser } = useAuth();
  const [msg, setMsg] = useState('');
  const [text, setText] = useState<DocumentData>([]);

  const sendMessage = async (event: any) => {
    event.preventDefault();

    if (!currentUser?.uid) {
      throw new Error('Current user does not exist');
    }

    if (!activeGroup) {
      throw new Error('Active group not present');
    }

    // TODO: DB.createMessage
    const message = createMessage(msg.trim(), currentUser.uid, activeGroup);
    await firestore.collection('messages').doc(message.id).set(message);
    setMsg('');
    // DB.updateGroupMessages
    await firestore
      .collection('groups')
      .doc(activeGroup)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(message.id)
      });
  };


  useEffect(() => {
    let unsubscribeMessage: UnsubscribeFn | null = null;

    if (activeGroup) {
      // TODO: DB.subscribeToMessages
      unsubscribeMessage = firestore
        .collection('messages')
        .where('groupId', '==', activeGroup)
        .orderBy('createdAt', 'asc')
        .limit(25)
        .onSnapshot(snapshot => {
          const docs: DocumentData = [];
          snapshot.forEach(doc => {
            docs.push({
              ...doc.data()
            });
          });
          setText(docs);
        });
    }

    return () => {
      if (unsubscribeMessage) {
        unsubscribeMessage();
      }
    };
  }, [activeGroup]);

  return (
    <div className='chatContainer'>
      {activeUser ? (
        <>
          {' '}
          <div className='chatWindow'>
            <div className='userInfo'>
              <div className='userDetails'>
                <div className='avatar'>{activeUser?.email.charAt(0)}</div>
                <h2>{activeUser?.email}</h2>
              </div>
              <div>
                <IoIosVideocam size={25} color='#191970' className='icon' />
                <IoIosCall size={25} color='#191970' className='icon' />
                <IoMdMore size={25} color='#191970' className='icon' />
              </div>
            </div>
            <div className='texts'>
              {text &&
                activeGroup &&
                text.map((item: firebase.firestore.DocumentData) => <MessageBubble key={item.id} message={item} />)}
            </div>
            <form onSubmit={sendMessage} className='inputContainer'>
              <input
                type='text'
                className='messageInput'
                placeholder='Type your message here'
                onChange={e => {
                  setMsg(e.target.value);
                }}
                value={msg}
              />
              <button type='submit' disabled={!msg || msg.trim().length === 0} className='sendButton'>
                <IoIosSend size={30} color='#191970' />
              </button>
            </form>
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
