import { createNewGroup } from '../context/collectionMethods';
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
    return firestore
    .collection('users')
    .doc(currentUserId)
    .onSnapshot(onSnapshot);

  }
}

export default DB;
