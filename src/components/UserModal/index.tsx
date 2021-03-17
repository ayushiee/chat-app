import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

import { firestore } from '../../utils/firebase';
import { createMessage, createGroup } from '../../context/collectionMethods';

interface UserModalProps {
  isOpen: boolean;
  currentUser: firebase.User | null;
  selectedUser: firebase.firestore.DocumentData | undefined;
}

function UserModal(props: UserModalProps) {
  const { isOpen, currentUser, selectedUser } = props;
  const [firstMsg, setFirstMsg] = useState('');
  const [groups, setGroups] = useState<firebase.firestore.DocumentData>();
  const userGroup = [currentUser?.uid, selectedUser?.id];

  useEffect(() => {
    const groups = firestore.collection('groups').onSnapshot(snapshot => {
      const docs: firebase.firestore.DocumentData = [];
      snapshot.forEach(doc => {
        docs.push({
          ...doc.data()
        });
      });
      setGroups(docs);
    });

    return groups;
  }, [selectedUser, currentUser]);

  const isGroup =
    groups &&
    groups.map((group: firebase.firestore.DocumentData) => {
      return userGroup.every(user => group.members?.includes(user));
    });

  const isGroupExists = isGroup?.includes(true);

  const sendMessage = async (e: any) => {
    e.preventDefault();

    const group = createGroup(currentUser?.uid, selectedUser?.id);
    const message = createMessage(firstMsg.trim(), currentUser?.uid, group.id);

    await firestore.collection('groups').doc(group.id).set(group);
    await firestore.collection('messages').doc(message.id).set(message);
    await firestore
      .collection('groups')
      .doc(group.id)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(message.id)
      });
    setFirstMsg('');

    // updating group id at both users
    await firestore
      .collection('users')
      .doc(currentUser?.uid)
      .update({
        group: firebase.firestore.FieldValue.arrayUnion(group.id)
      });
    await firestore
      .collection('users')
      .doc(selectedUser?.id)
      .update({
        group: firebase.firestore.FieldValue.arrayUnion(group.id)
      });
  };

  return isOpen && !isGroupExists ? (
    <>
      <div className='modalContainer'>
        {selectedUser?.email}
        <form onSubmit={sendMessage}>
          <input
            type='text'
            className='messageInput'
            placeholder='Say hi!'
            onChange={e => {
              setFirstMsg(e.target.value);
            }}
            value={firstMsg}
          />
          <button type='submit' disabled={!firstMsg || firstMsg.trim().length === 0}>
            Send
          </button>
        </form>
      </div>
    </>
  ) : null;
}

export default UserModal;
