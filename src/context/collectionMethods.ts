// Methods to create firestore document entries.

import cuid from 'cuid';

import { User, Group, Message, UserId, GroupId } from '../utils/types';

export function createNewMessage(text: string, createdBy: UserId, groupId: GroupId): Message {
  const message: Message = {
    id: cuid(),
    createdAt: new Date(),
    text,
    createdBy,
    groupId
  };

  return message;
}

export function createNewUser(id: UserId, email: string | null, groupId: GroupId): User {
  const user: User = {
    id,
    email,
    group: [groupId],
    createdAt: new Date()
  };

  return user;
}

export function createNewGroup(user1: UserId, user2: UserId): Group {
  const group: Group = {
    id: cuid(),
    createdAt: new Date(),
    members: [user1, user2]
  };

  return group;
}
