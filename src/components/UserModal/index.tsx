import React, { useState } from 'react';
import firebase from 'firebase';
import { IoIosSend } from 'react-icons/io';

import { firestore } from '../../utils/firebase';
import { Group, Message } from '../../utils/types';
import { createNewMessage, createNewGroup } from '../../context/collectionMethods';
import DB from '../../db';

import './UserModal.scss';

interface UserModalProps {
  isOpen: boolean;
  currentUser: firebase.User | null;
  selectedUser: firebase.firestore.DocumentData | undefined;
}

function UserModal(props: UserModalProps) {
  const { isOpen, currentUser, selectedUser } = props;
  const [firstMsg, setFirstMsg] = useState('');
  const [group, setGroup] = useState<Group>();
  const [message, setMessage] = useState<Message>();

  const sendMessage = async (event: any) => {
    event.preventDefault();

    if (!currentUser?.uid) {
      throw new Error('Current user does not exist');
    }

    // TODO: DB.createGroup
    // const group = createNewGroup(currentUser?.uid, selectedUser?.id);
    // await firestore.collection('groups').doc(group.id).set(group);

    DB.createGroup(currentUser?.uid, selectedUser?.id).then(res => setGroup(res));

    // TODO: DB.createMessage
    // const message = createNewMessage(firstMsg.trim(), currentUser?.uid, group.id);
    // await firestore.collection('messages').doc(message.id).set(message);
    if (group) {
      DB.createMessage(firstMsg, currentUser?.uid, group?.id).then(res => setMessage(res));

      if (message) {
        // TODO: DB.updateGroupMessages
        // await firestore
        //   .collection('groups')
        //   .doc(group.id)
        //   .update({
        //     messages: firebase.firestore.FieldValue.arrayUnion(message.id)
        //   });
        DB.updateGroupMessages(group.id, message.id);
        setFirstMsg('');

        // updating group id at both users
        DB.updateUserGroup(currentUser?.uid, group.id);
        DB.updateUserGroup(selectedUser?.uid, group.id);
      }
    }
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
