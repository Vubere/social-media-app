import React, { useState } from "react"

import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"

import { PostDetails } from "./PostItem"
import { db } from "../../main"

export default function Form({ details }: { details: PostDetails }) {
  const [commentText, setCommentText] = useState('')
  const { currentUser } = getAuth()

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() as any
    

    if (currentUser != null) {
      const date = Date.now()
      const docRef = doc(db, 'post', details.user)
      await updateDoc(docRef, {
        [`${details.date}.comments`]: arrayUnion({
          comment: commentText,
          userId: currentUser.uid,
          date
        })
      })
      setCommentText('')
    }

  }

  return (
    <>
      <div className="input">
        <form onSubmit={(e) => addComment(e)}>
          <input type="text" name="text" id="text"
            value={commentText}
            onChange={({ target }) => setCommentText(target.value)} />
          <button type="submit">
            comment
          </button>
        </form>
      </div>
    </>
  )
}