import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import firebase from 'firebase';

import { firestore } from '../../utils/firebase';
import { useAuth } from '../../context/auth';
import { createMessage, createGroup } from '../../context/collectionMethods';
import { ROUTES } from '../../utils/constants';
import { MessageBubble, AddContact } from '../../components';

import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.scss';

export default function ChatDashboard(): React.ReactElement {
  const { logout, currentUser } = useAuth();
  const history = useHistory();
  const [msg, setMsg] = useState('');
  const [text, setText] = useState<firebase.firestore.DocumentData>([]);
  const [existingUsers, setExistingUsers] = useState<firebase.firestore.DocumentData>([]);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<firebase.firestore.DocumentData>();

  const onSetSelectedUser = async (newUser: firebase.firestore.DocumentData) => {
    setSelectedUser(newUser);
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

  const sendMessage = async (e: any) => {
    e.preventDefault();

    const message = createMessage(msg.trim(), currentUser?.uid, '12355');

    await firestore.collection('messages').doc(message.id).set(message);

    setMsg('');
  };

  useEffect(() => {
    const message = firestore
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .limit(25)
      .onSnapshot(snapshot => {
        const docs: firebase.firestore.DocumentData = [];
        snapshot.forEach(doc => {
          docs.push({
            ...doc.data()
          });
        });
        setText(docs);
      });

    return message;
  }, []);

  return (
    <>
      <div className='main'>
        <h2>Chat Dashboard</h2>
        <form onSubmit={sendMessage}>
          <input
            type='text'
            className='messageInput'
            placeholder='Type your message here'
            onChange={e => {
              setMsg(e.target.value);
            }}
            value={msg}
          />
          <button type='submit' disabled={!msg || msg.trim().length === 0}>
            Send
          </button>
        </form>
        {text && text.map((item: firebase.firestore.DocumentData) => <MessageBubble key={item.id} message={item} />)}
        {existingUsers &&
          existingUsers.map((item: firebase.firestore.DocumentData) => {
            if (item.email !== currentUser?.email) {
              return <AddContact key={item.id} userDetails={item} onSetSelectedUser={onSetSelectedUser} onClick={handleModal} />;
            }
          })}
        <button type='button' onClick={() => handleLogout()}>
          Log out
        </button>
        <button type='button' onClick={() => showExistingUsers()}>
          Add contact
        </button>
        <CreateUserModal isOpen={isModal} currentUser={currentUser} selectedUser={selectedUser} />
      </div>
      <ToastContainer
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
      />
    </>
  );
}

function CreateUserModal({
  isOpen,
  currentUser,
  selectedUser
}: {
  isOpen: boolean;
  currentUser: firebase.User | null;
  selectedUser: firebase.firestore.DocumentData | undefined;
}) {
  const [firstMsg, setFirstMsg] = useState('');

  useEffect(() => {
    const userGroup = [currentUser?.uid, selectedUser?.id];
    // const groups = firestore.collection('groups').where('members', 'array-contains-any', userGroup).get();

    console.log('groupss: ', userGroup);
  }, [selectedUser]);

  const sendMessage = async (e: any) => {
    e.preventDefault();

    // const isGroup;
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
    // TODO: Check group collection for groups with currentUser and selectedUser and then render list
    setFirstMsg('');
  };

  return isOpen ? (
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
}
