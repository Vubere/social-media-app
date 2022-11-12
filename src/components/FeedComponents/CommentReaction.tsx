import { useState, } from "react"


import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayRemove, arrayUnion, } from "firebase/firestore";
import { db } from "../../main";

import { sendNotification } from "../../helpers/helpers";


import noLike from "../../assets/noLike.svg"
import liked from '../../assets/liked.png'
import { comment } from "./PostItem";


export default function CommentReaction({ commentInfo, id }: {
  commentInfo: comment,
  id: string
}) {
  const [likeArr, setLikes] = useState(commentInfo.likes)
  const { currentUser } = getAuth()

  const handleLike = async () => {

    if (currentUser != null) {
      const docRef = doc(db, 'post', id)
      if (likeArr != undefined) {
        if (likeArr.includes(currentUser.uid)) {
          await updateDoc(docRef, {
            [`comments.${commentInfo.commentId}.likes`]: arrayRemove(currentUser.uid)
          })
          const arr = likeArr.filter((v) => v != currentUser.uid)
          setLikes(arr)
        } else {
          setLikes(likeArr.concat([currentUser.uid]))
          await updateDoc(docRef, {
            [`comments.${commentInfo.commentId}.likes`]: arrayUnion(currentUser.uid)
          })
          sendNotification('like', commentInfo.userId, currentUser.uid, `${currentUser.displayName} liked your comment`)
        }
      }
    }
  }
  return (
    currentUser &&
      <span className="like" >
        <p>{likeArr.length > 0 ? likeArr.length : ''}</p>
        <img src={currentUser != undefined ? likeArr.includes(currentUser.uid) ? liked : noLike : noLike} alt="like"
          onClick={handleLike} />
      </span>
  )
}