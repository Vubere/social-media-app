import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayRemove, arrayUnion, } from "firebase/firestore";

import { db } from "../../main";

import { formatRelative, subDays } from "date-fns";

import { currentUser } from "../profileComponents/Header";

import { getUserById, sendNotification } from "../../helpers/helpers";


import { comment } from "./PostItem";

import defaultAvatar from "../../assets/defaultAvatar.jpg"
import noLike from "../../assets/noLike.svg"
import liked from '../../assets/liked.png'
import { Link } from "react-router-dom";

export default function CommentHint({ commentInfo, id }: { commentInfo: comment, id: string }) {
  const [h, setH] = useState<currentUser | undefined>()
  const [likeArr, setLikes] = useState(commentInfo.likes)
  const [commenter, setCommenter] = useState<string>()
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
  useEffect(()=>{
    if (commenter == undefined) {
      (async () => {
        const commentUser = await getUserById(commentInfo.userId)
        setCommenter(commentUser.username)
      })()
    }
  },[])

  useEffect(() => {
    (async () => {
      if (commentInfo.userId) {
        let u = await getUserById(commentInfo.userId)
        setH(u)
      }
    })()
  }, [commentInfo])


  return (
    <>
      {h != undefined && likeArr != undefined&&commenter!=undefined ? (<div className="commentHint">
        <div className="main">
          <div className="details">
            <div className="user">
              <img src={h.avatarUrl == "" ? defaultAvatar : h.avatarUrl} alt={h.username} width='50px' height='50px' />
              <Link to={`/profile/${commenter}`} className="username">{h.username}</Link>
            </div>
            <div className="comment">
              <p>{commentInfo.comment}</p>
            </div>
          </div>

          <span className="like" >
            <p>{likeArr.length > 0 ? likeArr.length : ''}</p>
            <img src={currentUser != undefined ? likeArr.includes(currentUser.uid) ? liked : noLike : noLike} alt="like"
              onClick={handleLike} />

          </span>

        </div>
        <div className="date">
          {formatRelative(subDays(Number(commentInfo.date), 0), new Date())}
        </div>
      </div>) : null}

    </>
  )
}