import { firebaseApp } from "../firebase-config";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { async } from "@firebase/util";

// Fetch all docs from Firebase

export const getAllFeeds = async (firestoreDb) => {
  const feeds = await getDocs(
    query(collection(firestoreDb, "videos"), orderBy("id", "desc"))
  );

  return feeds.docs.map((doc) => doc.data());
};

// Fetch user information using userID

export const getUserInfo = async (firestoreDb, userId) => {
  const userRef = doc(firestoreDb, "users", userId);

  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return "No Such Document";
  }
};

// Fetch the specific Video

export const getSpecificVideo = async (firestoreDb, videoId) => {
  const videoRef = doc(firestoreDb, "videos", videoId);

  const videoSnap = await getDoc(videoRef);
  if (videoSnap.exists()) {
    return videoSnap.data();
  } else {
    return "No Such Document";
  }
};

// Delete specific Video

export const deleteVideo = async (firestoreDb, videoId) => {
  await deleteDoc(doc(firestoreDb, "videos", videoId));
};
