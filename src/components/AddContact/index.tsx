import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

import { firestore } from '../../utils/firebase';
import { useAuth } from '../../context/auth';
import { UserModal } from '..';

import './AddContact.scss';

interface AddContactProps {
  userDetails: firebase.firestore.DocumentData;
}

function AddContact(props: AddContactProps): React.ReactElement {
  const { userDetails } = props;
  const { email } = userDetails;
  const { currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<firebase.firestore.DocumentData>();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [groups, setGroups] = useState<firebase.firestore.DocumentData>();
  const userGroup = [currentUser?.uid, userDetails?.id];
  const userEmail = email?.substring(0, email.lastIndexOf('@'));

  useEffect(() => {
    // TODO: DB.subscribeToGroups
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

  return (
    <>
      {!isGroupExists && (
        <div
          className={selectedUser?.id === userDetails?.id && isModal ? 'selectedUserContainer' : 'newUserContainer'}
          onClick={() => setSelectedUser(userDetails)}
        >
          <div className='title' onClick={() => setIsModal(!isModal)}>
            <div className='avatarNew'>{userEmail?.charAt(0)}</div>
            <div className='email'>{userEmail}</div>
          </div>
          <UserModal isOpen={isModal} currentUser={currentUser} selectedUser={selectedUser} />
        </div>
      )}
    </>
  );
}

export default AddContact;
