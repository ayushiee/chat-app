// Methods to create firestore document entries.

import cuid from 'cuid';

import { User, Group, Message, UserId, GroupId } from '../utils/types';

export function createMessage(text: string, createdBy: UserId, groupId: GroupId): Message {
  const message: Message = {
    id: cuid(),
    createdAt: new Date(),
    text,
    createdBy,
    groupId
  };

  return message;
}

export function createUser(id: UserId, name: string, email: string | null, groupId: GroupId): User {
  const user: User = {
    id,
    name,
    email,
    group: [groupId]
  };

  return user;
}

export function createGroup(user1: UserId, user2: UserId): Group {
  const group: Group = {
    id: cuid(),
    createdAt: new Date(),
    members: [user1, user2]
  };

  return group;
}
