import React, {useEffect, useState} from 'react';
import firebase from 'firebase';

import { firestore } from '../../utils/firebase';
import { createMessage, createGroup } from '../../context/collectionMethods';


function UserModal({
    isOpen,
    currentUser,
    selectedUser
  }: {
    isOpen: boolean;
    currentUser: firebase.User | null;
    selectedUser: firebase.firestore.DocumentData | undefined;
  }) {
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
  };

  export default UserModal;
  