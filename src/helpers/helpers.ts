import {
  collection,
  getDocs,
  query,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDoc,
  doc,
  FieldValue,
  increment,
} from "firebase/firestore";
import { db } from "../main";
import { User, getAuth } from "firebase/auth";
import { where } from "firebase/firestore";

import { currentUser } from "../components/profileComponents/Header";

export async function doesUserNameExist(username: string) {
  const docRef = collection(db, "users");
  const q = query(docRef, where("username", "==", username));
  const snapShot = await getDocs(q);

  return !snapShot.empty;
}


export async function getSuggestions(user: currentUser) {
  let arr: any = [];
  const docRef = collection(db, "users");
  const snapShot = await getDocs(docRef);
  snapShot.forEach((doc) => {
    if (
      !doc.data()?.followers?.includes(user.userID) &&
      doc.data()?.username != user.username
    ) {
      arr.push(doc.data());
    }
  });
  return arr.slice(0, 20);
}

export async function toggleFollowAUser(
  following: currentUser,
  setFollowing: React.Dispatch<React.SetStateAction<boolean>>,
  followed: boolean
) {
  const auth = getAuth();
  
  try {
    setFollowing(!followed);
    
    const curUserUid = auth.currentUser?.uid;
    if (curUserUid != undefined) {
      const docRef = doc(db, "users", following.userID);
      const docRefCurUser = doc(db, "users", curUserUid);
      await setDoc(
        docRef,
        {
          followers: !followed
            ? arrayUnion(curUserUid)
            : arrayRemove(curUserUid),
        },
        {
          merge: true,
        }
      );
      await setDoc(
        docRefCurUser,
        {
          following: !followed
            ? arrayUnion(following.userID)
            : arrayRemove(following.userID),
        },
        {
          merge: true,
        }
      );
    }
  } catch (error) {
    setFollowing(!following);
  }
}

export async function getUserById(id: string): Promise<currentUser> {
  const docRef = doc(db, "users", id);
  const snapShot = await getDoc(docRef);
  return snapShot.data() as currentUser;
}

export async function sendNotification(
  type: string,
  userID: string,
  sender: string,
  details: string
) {
  const docRef = doc(db, "notifications", userID);
  const time = Date.now();
  await setDoc(
    docRef,
    {
      [time]: {
        type,
        time: time,
        details,
        seen: false,
        sender
      },
      unread: increment(1),
    },
    { merge: true }
  );
}
