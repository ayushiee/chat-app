import React from 'react';
import firebase from 'firebase';
import { useAuth } from '../../context/auth';

interface MessageBubble {
  message: firebase.firestore.DocumentData;
}

export default function MessageBubble(props: MessageBubble): React.ReactElement {
  const { message } = props;
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
