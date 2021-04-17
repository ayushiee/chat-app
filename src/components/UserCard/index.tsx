import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

import { firestore } from '../../utils/firebase';

import './UserCard.scss';
import { GroupId, User, UserId } from '../../utils/types';

interface UserCard {
  groupId: GroupId;
  onSelectGroup: (id: string, chosenUser: firebase.firestore.DocumentData | undefined) => void;
  currentUserId: UserId | null;
}

function UserCard(props: UserCard): React.ReactElement {
  const { groupId, onSelectGroup, currentUserId } = props;
  const [name, setName] = useState<string | null>(null);
  const [userSelect, setUserSelect] = useState<firebase.firestore.DocumentData | undefined>();
  const userName = name?.substring(0, name.lastIndexOf('@'));

  // TODO: should be already resolved to User until it reaches here using DB.getExistingUsers
  const getUserByGroupId = async (groupId: GroupId): Promise<User> => {
    const snapShot = await firestore.collection('groups').doc(groupId).get();
    const groupData = snapShot.data();
    const userId = groupData?.members.filter((id: string) => id !== currentUserId);
    const id = userId.toString();

    const userSnap = (await firestore.collection('users').doc(id).get()).data() as User;
    return userSnap;
  };

  useEffect(() => {
    getUserByGroupId(groupId)
      .then((user: User) => {
        setName(user?.email);
        setUserSelect(user);
      });
  }, []);

  return (
    <div className='userContainer' onClick={() => onSelectGroup(groupId, userSelect)}>
      <div className='avatar'>{userName?.charAt(0)}</div>
      <div className='name'>{userName}</div>
    </div>
  );
}

export default UserCard;
