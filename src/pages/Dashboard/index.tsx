import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import firebase from 'firebase';

import { firestore } from '../../utils/firebase';
import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';
import { MessageBubble, AddContact, UserModal, ChatWindow } from '../../components';

import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.scss';
import UserCard from '../../components/UserCard';
import { IoAddOutline, IoExit, IoClose } from 'react-icons/io5';

export default function ChatDashboard(): React.ReactElement {
  const { logout, currentUser } = useAuth();
  const history = useHistory();
  const [isAddUser, setIsAddUser] = useState<boolean>(false);
  const [existingUsers, setExistingUsers] = useState<firebase.firestore.DocumentData>([]);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<firebase.firestore.DocumentData>();
  const [user, setUser] = useState<firebase.firestore.DocumentData | undefined>();
  const [userGroup, setUserGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [userSelect, setUserSelect] = useState<firebase.firestore.DocumentData | undefined>();

  const onSetSelectedUser = async (newUser: firebase.firestore.DocumentData) => {
    setSelectedUser(newUser);
  };

  const onSelectGroup = (id: string, userSelect: firebase.firestore.DocumentData | undefined) => {
    setSelectedGroup(id);
    setUserSelect(userSelect);
  };

  const handleModal = (isOpen: boolean) => {
    setIsModal(isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      history.push(ROUTES.LOGIN);
      toast('Successfully Logged out.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const showExistingUsers = () => {
    firestore.collection('users').onSnapshot(snapshot => {
      const docs: firebase.firestore.DocumentData = [];
      snapshot.forEach(doc => {
        docs.push({
          ...doc.data()
        });
      });
      setExistingUsers(docs);
    });
  };

  const getUser = async (id: string | undefined) => {
    const snapshot = await firestore.collection('users').doc(id).get();
    return snapshot.data();
  };

  useEffect(() => {
    getUser(currentUser?.uid).then(user => {
      setUser(user);
      setUserGroup(user?.group);
    });
  }, [user]);

  return (
    <>
      <div className='main'>
        <div className='content'>
          <div className='leftPanel'>
            <div className='header'>
              <h2>{isAddUser ? 'Add User' : 'Messages'}</h2>
              <div className='iconsRow'>
                {isAddUser ? (
                  <IoClose size={24} color='#191970' className='icon' onClick={() => setIsAddUser(!isAddUser)} />
                ) : (
                  <IoAddOutline
                    size={24}
                    color='#191970'
                    className='icon'
                    onClick={() => {
                      setIsAddUser(!isAddUser);
                      showExistingUsers();
                    }}
                  />
                )}
                <IoExit size={22} color='#191970' className='icon' onClick={() => handleLogout()} />
              </div>
            </div>
            <div>
              {isAddUser
                ? existingUsers &&
                  existingUsers.map((item: firebase.firestore.DocumentData) => {
                    if (item.email !== currentUser?.email) {
                      return (
                        <AddContact
                          key={item.id}
                          userDetails={item}
                          onSetSelectedUser={onSetSelectedUser}
                          onClick={handleModal}
                        />
                      );
                    }
                  })
                : userGroup &&
                  userGroup.map((item: any, index) => {
                    if (item.length !== 0) {
                      return (
                        <UserCard key={index} groupId={item} onSelectGroup={onSelectGroup} currentUser={user?.id} />
                      );
                    }
                  })}
              <UserModal isOpen={isModal} currentUser={currentUser} selectedUser={selectedUser} />
            </div>
          </div>
          <ChatWindow activeUser={userSelect} activeGroup={selectedGroup} />
        </div>
        {/* <ToastContainer
        position='bottom-right'
        autoClose={4000}
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      </div>
    </>
  );
}
