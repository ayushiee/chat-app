import React from 'react';
import firebase from 'firebase';

import { useAuth } from '../../context/auth';

import './MessageBubble.scss';

interface MessageBubble {
  message: firebase.firestore.DocumentData;
}

export default function MessageBubble(props: MessageBubble): React.ReactElement {
  const { message } = props;
  const { text, uid, createdBy } = message;
  const { currentUser } = useAuth();
  const messageClass = createdBy === currentUser?.uid ? 'sent' : 'received';
  return (
    <>
      <div className={`${messageClass}Bubble`}>
        <span>{text}</span>
      </div>
    </>
  );
}
