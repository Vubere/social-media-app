import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"


import { comment, PostDetails } from "../components/FeedComponents/PostItem"
import { db } from "../main"

import CommentHint from "../components/FeedComponents/CommentHint"
import Reactions from "../components/FeedComponents/Reactions"
import Form from "../components/FeedComponents/CommentForm"

import { getUserById } from "../helpers/helpers"
import { currentUser } from "../components/profileComponents/Header"


import defaultAvatar from '../assets/defaultAvatar.jpg'

export default function PostCommentsPage() {
  const { id } = useParams()
  const [post, setPost] = useState<PostDetails>()
  const [user, setUser] = useState<currentUser>()
  const [comments, setComments] = useState<comment[]>()

  const commentRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (id) {
      const docRef = doc(db, 'post', id)
      
      const unsubscribe = onSnapshot(docRef, (docs) => {
        if (docs.exists()) {
          const data = docs.data()
          if (data != undefined) {
            (async () => {
              const user = await getUserById(data.user)
              setUser(user)
            })()
            setPost(data as PostDetails)
            const comArr:comment[] = Object.values(data.comments)
            setComments(comArr)
          }
        }
      })
      return unsubscribe
    }
  }, [id])
  return post != undefined&&user != undefined&& id!=undefined&&comments!=undefined ? (<section className="commentsPage">
    <header>
      <section className="userInfo">
        <div className="imgHead">
          <img src={user.avatarUrl == "" ? defaultAvatar : user.avatarUrl} alt={user.username} width='40px' />
        </div>
        <div className="details">
          <p className="fullname">{user.fullName}</p>
          <p className="username">@{user.username}</p>
        </div>
      </section>
      <div className="options">...</div>
    </header>
    <p className="text">
      {post.caption}
    </p>
    {post.imagePath !== '' &&
      <div className="img">
        <img src={post.imagePath} alt="post Image" width='80%' />
      </div>
    }
    <Reactions details={post} commentRef={commentRef} id={id} />
    <Form details={post} id={id} commentRef={commentRef} />
    {comments.sort((a,b)=>b.date-a.date).map((val) => <CommentHint id={id}commentInfo={val} />)}
  </section>) : <></>
}