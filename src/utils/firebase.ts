import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import config from '../config.json';

const firebaseConfig = config.firebase;

firebase.initializeApp(firebaseConfig);

export type Auth = firebase.auth.Auth;
export type Firestore = firebase.firestore.Firestore;
export type UnsubscribeFn = () => void;
export type SnapshotFn = (snapshot: DocumentSnapshot<DocumentData>) => void;
export type DocumentData = firebase.firestore.DocumentData;
export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;

export const auth: Auth = firebase.auth();
export const firestore: Firestore = firebase.firestore();