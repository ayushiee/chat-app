import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import config from '../config.json';

const firebaseConfig = config.firebase;

firebase.initializeApp(firebaseConfig);

export const auth: any = firebase.auth();
export const firestore: any = firebase.firestore();
