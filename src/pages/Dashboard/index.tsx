import React, { useEffect, useState } from 'react';
import { IoAddOutline, IoClose, IoExit } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddContact, ChatWindow } from '../../components';
import UserCard from '../../components/UserCard';
import { useAuth } from '../../context/auth';
import { ROUTES } from '../../utils/constants';
import { DocumentData, firestore, UnsubscribeFn } from '../../utils/firebase';
import { GroupId, User } from '../../utils/types';
import './Dashboard.scss';

export default function ChatDashboard(): React.ReactElement {
  const { logout, currentUser } = useAuth();
  const history = useHistory();
  const [isAddUser, setIsAddUser] = useState<boolean>(false);
  const [existingUsers, setExistingUsers] = useState<DocumentData>([]);
  const [user, setUser] = useState<DocumentData | undefined>();
  const [userGroup, setUserGroup] = useState<GroupId[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [userSelect, setUserSelect] = useState<DocumentData | undefined>();

  const onSelectGroup = (id: string, userSelect: DocumentData | undefined) => {
    setSelectedGroup(id);
    setUserSelect(userSelect);
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

  const onIsAddUser = async () => {
    setIsAddUser(!isAddUser);
    await updateExistingUsers();
  };

  const updateExistingUsers = async () => {
    // TODO: DB.getExistingUsers, resolve directly to User[], in a single query rather than (UserId -> User)[]
    const foundUsers = await firestore.collection('users').get();
    const existingUsers: User[] = foundUsers.docs.map(foundUser => foundUser.data() as User);
    setExistingUsers(existingUsers);
  };

  useEffect(() => {
    let unsubscribeUser: UnsubscribeFn | null = null;
    if (currentUser?.uid) {
      // TODO: DB.subscribeToCurrentUser
      unsubscribeUser = firestore.collection('users')
        .doc(currentUser.uid)
        .onSnapshot(snapshot => {
          const user: User = snapshot.data() as User;
          setUser(user);
          setUserGroup(user.group);
        });
    }

    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [currentUser]);

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
                    onClick={onIsAddUser}
                  />
                )}
                <IoExit size={22} color='#191970' className='icon' onClick={() => handleLogout()} />
              </div>
            </div>
            <div>
              {isAddUser
                ? existingUsers &&
                existingUsers.map((item: DocumentData) => {
                  if (item.email !== currentUser?.email) {
                    return <AddContact key={item.id} userDetails={item} />;
                  }
                })
                : React.Children.toArray(userGroup.map((groupId: GroupId) => {
                  if (groupId.length !== 0) {
                    return (
                      <UserCard
                        groupId={groupId}
                        onSelectGroup={onSelectGroup}
                        currentUserId={user?.id}
                      />
                    );
                  }
                }))}
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
