// Types for firestore collections. 

export type UserId = string;

export type GroupId = string;

export type MessageId = string;

export type User = {
  id: UserId;
  createdAt: Date;
  email: string | null;
  group: GroupId[];
};

export type Group = {
  id: GroupId;
  createdAt: Date;
  members: UserId[];
};

export type Message = {
  id: MessageId;
  text: string;
  createdAt: Date;
  createdBy: UserId;
  groupId: GroupId;
};
