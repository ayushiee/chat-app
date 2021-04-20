import firebase from 'firebase';

import { createNewGroup, createNewMessage } from '../context/collectionMethods';
import { SnapshotFn, UnsubscribeFn, firestore } from '../utils/firebase';
import { Group, GroupId, Message, MessageId, User, UserId } from '../utils/types';

interface IDB {
  // User
  getExistingUsers(currentUserId: UserId, limit?: number): Promise<User[]>;
  getUserByGroupId(currentUserId: UserId, groupId: GroupId): Promise<User>;
  subscribeToCurrentUser(currentUserId: UserId, onSnapshot: SnapshotFn): UnsubscribeFn;
  updateUserGroup(userId: UserId, groupId: GroupId): Promise<void>;

  // Group
  createGroup(currentUserId: UserId, selectedUserId: UserId): Promise<Group>;
  updateGroupMessages(groupId: GroupId, messageId: MessageId): Promise<void>;
  subscribeToGroups(onSnapshot: SnapshotFn): UnsubscribeFn;

  // Message
  createMessage(text: string, createdBy: UserId, groupId: GroupId): Promise<Message>;
  subscribeToMessages(groupId: GroupId, onSnapshot: SnapshotFn): UnsubscribeFn;
}

class DB {
  // User
  static async getExistingUsers(): Promise<User[]> {
    const foundUsers = await firestore.collection('users').get();
    const existingUsers: User[] = foundUsers.docs.map(foundUser => foundUser.data() as User);
    return existingUsers;
  }

  static subscribeToCurrentUser(currentUserId: UserId, onSnapshot: SnapshotFn): UnsubscribeFn {
    return firestore.collection('users').doc(currentUserId).onSnapshot(onSnapshot);
  }

  static async updateUserGroup(userId: UserId, groupId: GroupId): Promise<void> {
    await firestore
      .collection('users')
      .doc(userId)
      .update({
        group: firebase.firestore.FieldValue.arrayUnion(groupId)
      });
  }

  static async createGroup(currentUserId: UserId, selectedUserId: UserId): Promise<Group> {
    const group = createNewGroup(currentUserId, selectedUserId);
    await firestore.collection('groups').doc(group.id).set(group);
    return group;
  }

  static async updateGroupMessages(groupId: GroupId, messageId: MessageId): Promise<void> {
    await firestore
      .collection('groups')
      .doc(groupId)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(messageId)
      });
  }

  static async createMessage(text: string, createdBy: UserId, groupId: GroupId): Promise<Message> {
    const message = createNewMessage(text.trim(), createdBy, groupId);
    await firestore.collection('messages').doc(message.id).set(message);
    return message;
  }
}

export default DB;
