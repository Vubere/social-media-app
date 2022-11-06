
import { useEffect, useRef, useState } from "react";


import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../main";

import Form from "./CommentForm";
import CommentHint from "./CommentHint";
import Reactions from "./Reactions";
import { Link } from "react-router-dom";

import { getUserById } from "../../helpers/helpers";

import { currentUser } from "../profileComponents/Header";

import defaultAvatar from "../../assets/defaultAvatar.jpg"

import comment from '../../assets/addComment.svg'


export default function PostItem({ postId }: { postId: string }) {

  const [postOwner, setPostOwner] = useState<currentUser | undefined>()
  const [postDetails, setPostDetails] = useState<PostDetails | undefined>()
  const [comments, setComments] = useState<comment[]>()
  const commentRef = useRef<HTMLInputElement>()

  useEffect(() => {
    const docRef = doc(db, 'post', postId)
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const post = doc.data() as PostDetails
        (async () => {
          const user = await getUserById(post.user)
          setPostOwner(user)
        })()
        setPostDetails(post)
        const comArr:comment[] = Object.values(post.comments)
        setComments(comArr)
      }
    })
    return unsubscribe
  }, [postId])


  return postDetails !== undefined && postOwner !== undefined &&comments!=undefined? (
    <article className="postItem">
      <>
        <header>
          <section className="userInfo">
            <div className="imgHead">
              <img src={postOwner.avatarUrl == "" ? defaultAvatar : postOwner.avatarUrl} alt={postOwner.username} width='40px' />
            </div>
            <div className="details">
              <p className="fullname">{postOwner.fullName}</p>
              <p className="username">@{postOwner.username}</p>
            </div>
          </section>
          <div className="options">...</div>
        </header>
        <p className="text">
          {postDetails.caption}
        </p>
        {postDetails.imagePath !== '' &&
          <div className="img">
            <img src={postDetails.imagePath} alt="post Image" width='80%' />
          </div>
        }
        <Reactions details={postDetails} commentRef={commentRef} id={postId} />
        {
          comments.length ?
            <div className="commentDisplay">

              {comments.sort((a, b) => b.date - a.date).slice(0, comments.length > 3 ? 3 : comments.length).map((commentInfo) => <CommentHint commentInfo={commentInfo}
                id={postId}
                key={commentInfo.comment + '' + Math.random()} />)}
              <Link to={`/post/${postId}/comments`}>See comments...</Link>
            </div> : <div className="noComments"></div>
        }
        <Form details={postDetails} id={postId} commentRef={commentRef} />
      </>
    </article>

  ) : null
}


export type PostDetails = {
  user: string;
  caption: string;
  comments: any;
  date: number;
  imagePath?: string;
  likes: string[];
}
export type comment = {
  comment: string;
  userId: string;
  date: number;
  likes: string[];
  commentId: string
}