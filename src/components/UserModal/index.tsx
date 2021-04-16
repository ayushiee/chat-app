import React, { useState } from 'react';
import firebase from 'firebase';
import { IoIosSend } from 'react-icons/io';

import { firestore } from '../../utils/firebase';
import { createMessage, createGroup } from '../../context/collectionMethods';

import './UserModal.scss';

interface UserModalProps {
  isOpen: boolean;
  currentUser: firebase.User | null;
  selectedUser: firebase.firestore.DocumentData | undefined;
}

function UserModal(props: UserModalProps) {
  const { isOpen, currentUser, selectedUser } = props;
  const [firstMsg, setFirstMsg] = useState('');

  const sendMessage = async (e: any) => {
    e.preventDefault();

    if (!currentUser?.uid) {
      throw new Error('Current user does not exist');
    }

    // TODO: DB.createGroup
    const group = createGroup(currentUser?.uid, selectedUser?.id);
    await firestore.collection('groups').doc(group.id).set(group);

    // TODO: DB.createMessage
    const message = createMessage(firstMsg.trim(), currentUser?.uid, group.id);
    await firestore.collection('messages').doc(message.id).set(message);
    
    // TODO: DB.updateGroupMessages
    await firestore
      .collection('groups')
      .doc(group.id)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(message.id)
      });
    setFirstMsg('');

    // updating group id at both users
    // TODO: DB.updateUserGroup with currentUserId as userId
    await firestore
      .collection('users')
      .doc(currentUser?.uid)
      .update({
        group: firebase.firestore.FieldValue.arrayUnion(group.id)
      });
    // TODO: DB.updateUserGroup with selectedUserId as userId
    await firestore
      .collection('users')
      .doc(selectedUser?.id)
      .update({
        group: firebase.firestore.FieldValue.arrayUnion(group.id)
      });
  };

  return isOpen ? (
    <>
      <form onSubmit={sendMessage} className='modalContainer'>
        <input
          type='text'
          className='messageInput'
          placeholder='Say hi!'
          onChange={e => {
            setFirstMsg(e.target.value);
          }}
          value={firstMsg}
        />
        <button type='submit' disabled={!firstMsg || firstMsg.trim().length === 0} className='button'>
          <IoIosSend size={20} color='#191970' />
        </button>
      </form>
    </>
  ) : null;
}

export default UserModal;
