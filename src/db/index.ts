import { SnapshotFn, UnsubscribeFn } from "../utils/firebase";
import { Group, GroupId, Message, MessageId, User, UserId } from "../utils/types";

abstract class DB {
  // User
  abstract getExistingUsers(currentUserId: UserId, limit?: number): Promise<User[]>;

  abstract getUserByGroupId(currentUserId: UserId, groupId: GroupId): Promise<User>;

  abstract subscribeToCurrentUser(currentUserId: UserId, onSnapshot: SnapshotFn): UnsubscribeFn;

  // Group
  abstract createGroup(currentUserId: UserId, selectedUserId: UserId): Promise<Group>;

  abstract subscribeToGroups(onSnapshot: SnapshotFn): UnsubscribeFn;

  abstract updateGroupMessages(groupId: GroupId, messageId: MessageId): Promise<void>;

  // Message
  abstract createMessage(text: string, createdBy: UserId, groupId: GroupId): Promise<Message>;

  abstract updateUserGroup(userId: UserId, groupId: GroupId): Promise<void>;

  abstract subscribeToMessages(groupId: GroupId, onSnapshot: SnapshotFn): UnsubscribeFn;
}

export default DB;