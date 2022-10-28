
import { useEffect, useState } from "react";

import { formatRelative, subDays } from "date-fns";

import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../main";

import Form from "./CommentForm";
import CommentHint from "./CommentHint";

import { getUserById } from "../../helpers/helpers";

import { currentUser } from "../profileComponents/Header";

import defaultAvatar from "../../assets/defaultAvatar.jpg"
import noLike from "../../assets/noLike.svg"
import liked from '../../assets/liked.png'
import comment from '../../assets/addComment.svg'


export default function PostItem({ details }: { details: PostDetails }) {
  const [likeArr, setLikes] = useState(details.likes)

  const { user, caption, comments, date, imagePath } = details
  const [postOwner, setPostOwner] = useState<currentUser | undefined>()
  const { currentUser } = getAuth()

  const handleLike = async () => {
    if (currentUser != null) {
      const docRef = doc(db, 'post', details.user)
      if (likeArr.includes(currentUser.uid)) {
        await updateDoc(docRef, {
          [`${date}.likes`]: arrayRemove(currentUser.uid)
        })
        const h = await getDoc(docRef)
        let l = h.data()
        if (l != undefined) {
          const f = l[date].likes
          setLikes(f)
        }
      } else {
        setLikes(likeArr.concat([currentUser.uid]))
        await updateDoc(docRef, {
          [`${date}.likes`]: arrayUnion(currentUser.uid)
        })
      }
    }
  }


  useEffect(() => {
    (async () => {
      try {
        const UserDetails = await getUserById(user)
        if (UserDetails) {
          setPostOwner(UserDetails)
        }
      } catch (error) {

      }
    })()
  }, [details])

  return postOwner !== undefined ? (
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
          {caption}
        </p>
        {imagePath !== '' &&
          <div className="img">
            <img src={imagePath} alt="post Image" width='80%' />
          </div>
        }
        <div className="reactions">
          <span className="like" >

            <img src={currentUser != undefined ? likeArr.includes(currentUser.uid) ? liked : noLike : noLike} alt="like"
              onClick={handleLike} />

            <p>{likeArr.length > 0 ? likeArr.length : ''}</p>
          </span>
          <span className="comment">

            <img src={comment} alt="comment" />

            <p>{comments.length > 0 ? comments.length : ''}</p>
          </span>
        </div>
        {
          comments.length ?
            <div className="commentDisplay">

              {comments.slice(0, comments.length > 3 ? 3 : comments.length).map((commentInfo) => <CommentHint commentInfo={commentInfo}
                key={commentInfo.comment + '' + Math.random()}/>)}
            </div> : null
        }
        <Form details={details} />
      </>
    </article>

  ) : null
}


export type PostDetails = {
  user: string;
  caption: string;
  comments: comment[];
  date: number;
  imagePath?: string;
  likes: string[];
}
export type comment = {
  comment: string;
  userId: string;
  date: number;
}