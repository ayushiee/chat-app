// Types for firestore collections. 

export type UserId = string | undefined;

export type GroupId = string | undefined;

export type MessageId = string | undefined;

export type Users = {
  id: UserId;
  name: string;
  email: string | undefined | null;
  group: GroupId[];
};

export type Groups = {
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
