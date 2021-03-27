import React from 'react';
import firebase from 'firebase';

import './UserCard.scss';

interface UserCard {
  groupId: any;
  onSelectGroup: (id: string) => void;
  currentUser: firebase.User | null;
}

export default function UserCard(props: UserCard): React.ReactElement {
  const { groupId, onSelectGroup, currentUser } = props; // getting group id
  // TODO: check group doc and get user id (!== currentUser).
  // lookup that selected user id in collections and fetch email.

  return (
    <div className='userContainer' onClick={() => onSelectGroup(groupId)}>
      <div className='name'>lalala {groupId}</div>
    </div>
  );
}
