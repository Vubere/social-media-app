import React, { useState } from "react"

import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getUserById, sendNotification } from "../../helpers/helpers"

import { PostDetails } from "./PostItem"
import { db } from "../../main"

export default function Form({ details, id , commentRef}: { details: PostDetails, id:string, commentRef:any }) {
  const [commentText, setCommentText] = useState('')
  const { currentUser } = getAuth()
  const allowComment = commentText!=''
  
  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() as any
    
    
    if (currentUser != null&&allowComment) {
      console.log(allowComment)
      const date = Date.now()
      const docRef = doc(db, 'post', id)
      const user = await getUserById(currentUser.uid)
      await updateDoc(docRef, {
        [`comments.${date+currentUser.uid}`]:{
          comment: commentText,
          userId: currentUser.uid,
          date,
          commentId: date+currentUser.uid,
          likes: []
        }
      })
      
      sendNotification('comment', details.user, currentUser.uid, `${user.username} commented on your post`)
      setCommentText('')
    }

  }

  return (
    <>
      <div className="inputComment">
        <form onSubmit={(e) => addComment(e)}>
          <input type="text" name="text" id="text"
            value={commentText}
            ref={commentRef}
            onChange={({ target }) => setCommentText(target.value)} />
          <button type="submit"
          className={!allowComment?'disabled':''}
          disabled={!allowComment}>
            comment
          </button>
        </form>
      </div>
    </>
  )
}