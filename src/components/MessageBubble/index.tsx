import React from 'react';
import firebase from 'firebase';
import { useAuth } from '../../context/auth';

export default function MessageBubble({ message }: { message: firebase.firestore.DocumentData }): React.ReactElement {
  const { text, uid } = message;
  const { currentUser } = useAuth();
  const messageClass = uid === currentUser?.uid ? 'sent' : 'received';

  console.log(message);
  return (
    <>
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    </>
  );
}
