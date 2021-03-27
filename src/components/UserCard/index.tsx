import React, { useState } from 'react';
import firebase from 'firebase';

import './UserCard.scss';
import { firestore } from '../../utils/firebase';

interface UserCard {
  groupId: any;
  onSelectGroup: (id: string) => void;
  currentUser: firebase.User | null;
}

function UserCard(props: UserCard): React.ReactElement {
  const { groupId, onSelectGroup, currentUser } = props; // getting group id
  const [name, setName] = useState<string>();

  const getOtherUserId = async (groupId: any) => {
    const snapShot = await firestore.collection('groups').doc(groupId).get();
    const groupData = snapShot.data();
    const userId = groupData?.members.filter((id: any) => id !== currentUser);
    const id = userId.toString();

    const userSnap = await (await firestore.collection('users').doc(id).get()).data();
    return userSnap?.email;
  };

  getOtherUserId(groupId).then(item => setName(item));

  return (
    <div className='userContainer' onClick={() => onSelectGroup(groupId)}>
      <div className='name'>{name}</div>
    </div>
  );
}

export default UserCard;
