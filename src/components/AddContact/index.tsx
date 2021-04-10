import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

import { firestore } from '../../utils/firebase';
import { useAuth } from '../../context/auth';
import './AddContact.scss';
import { UserModal } from '..';

interface AddContactProps {
  userDetails: firebase.firestore.DocumentData;
  onSetSelectedUser: (user: firebase.firestore.DocumentData) => void;
  onClick: (isModal: boolean) => void;
}

function AddContact(props: AddContactProps): React.ReactElement {
  const { userDetails, onClick, onSetSelectedUser } = props;
  const { email } = userDetails;
  const { currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<firebase.firestore.DocumentData>();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [groups, setGroups] = useState<firebase.firestore.DocumentData>();
  console.log('eeee: ', userDetails);
  // const userGroup = [currentUser?.uid, selectedUser?.id];
  const userGroup = [currentUser?.uid, userDetails?.id];

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

  // useEffect(() => {
  //   onClick(isModal);
  // }, [isModal]);

  return (
    <>
      {!isGroupExists && (
        <div
          className='newUserContainer'
          onClick={() => {
            // onSetSelectedUser(userDetails);
            setSelectedUser(userDetails);
            setIsModal(!isModal);
          }}
        >
          <div className='title'>
            <div className='avatarNew'>{email?.charAt(0)}</div>
            <div className='email'>{email}</div>
          </div>
          <UserModal isOpen={isModal} currentUser={currentUser} selectedUser={selectedUser} />
        </div>
      )}
    </>
  );
}

export default AddContact;
