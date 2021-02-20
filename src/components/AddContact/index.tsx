import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

import { useAuth } from '../../context/auth';
import './AddContact.scss';

function AddContact({
  userDetails,
  onSetSelectedUser,
  onClick
}: {
  userDetails: firebase.firestore.DocumentData;
  onSetSelectedUser: (user: firebase.firestore.DocumentData) => void;
  onClick: (isModal: boolean) => void;
}): React.ReactElement {
  const { email } = userDetails;
  const { currentUser } = useAuth();
  const [isModal, setIsModal] = useState<boolean>(false);

  useEffect(() => {
    onClick(isModal);
  }, [isModal]);

  return (
    <>
      <div className='newContact'>
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
