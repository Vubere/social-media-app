import { useState } from "react"

import { sendNotification } from "../../helpers/helpers"
import { getAuth } from "firebase/auth"
import { updateDoc, doc, getDoc, arrayRemove, arrayUnion } from "firebase/firestore"
import { db } from "../../main"

import { PostDetails } from "./PostItem"

import noLike from "../../assets/noLike.svg"
import liked from '../../assets/liked.png'
import comment from '../../assets/addComment.svg'


export default function Reactions({details, id, commentRef}:{details:PostDetails, id:string, commentRef:any}){
  const [likeArr, setLikes] = useState(details.likes)
  const {currentUser} = getAuth()
  const { comments} = details

  const handleLike = async () => {
    if (currentUser != null) {
      const docRef = doc(db, 'post', id)
      if (likeArr.includes(currentUser.uid)) {
        await updateDoc(docRef, {
          likes: arrayRemove(currentUser.uid)
        })
        const arr = likeArr.filter((v) => v != currentUser.uid)
        setLikes(arr)
      } else {
        setLikes(likeArr.concat([currentUser.uid]))
        await updateDoc(docRef, {
          likes: arrayUnion(currentUser.uid)
        })
        sendNotification('like', details.user, currentUser.uid, `${currentUser.displayName} liked your comment`)
      }
    }
  }


  
  return (
      <div className="reactions">
          <span className="like" >
            <p>{likeArr.length > 0 ? likeArr.length : ''}</p>

            <img src={currentUser != undefined ? likeArr.includes(currentUser.uid) ? liked : noLike : noLike} alt="like"
              onClick={handleLike} />

          </span>
          <span className="comment"
          onClick={()=>commentRef.current.focus()}>

            <p>{comments.length > 0 ? comments.length : ''}</p>
            <img src={comment} alt="comment" />

          </span>
        </div>
  )
}