import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

import { useAuth } from '../../context/auth';

function AddContact({
  userDetails,
  onSetSelectedUser,
  onClick
}: {
  userDetails: firebase.firestore.DocumentData;
  onSetSelectedUser: (user: firebase.firestore.DocumentData) => void;
  onClick: (isModal: boolean) => void;
}): React.ReactElement {
  const { id, email } = userDetails;
  const { currentUser } = useAuth();
  const userClass = id === currentUser?.uid ? 'added' : 'new';
  const [isModal, setIsModal] = useState<boolean>(false);

  useEffect(() => {
    onClick(isModal);
  }, [isModal]);

  return (
    <>
      <div className={`userDetails ${userClass}`}>
        <div
          onClick={() => {
            onSetSelectedUser(userDetails);
            setIsModal(!isModal);
          }}
        >
          {email}
        </div>
      </div>
    </>
  );
}

export default AddContact;
