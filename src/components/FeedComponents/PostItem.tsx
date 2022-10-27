
import { useEffect, useState } from "react";

import { getAuth } from "firebase/auth";
import { getUserById } from "../../helpers/helpers";
import { currentUser } from "../profileComponents/Header";
import defaultAvatar from "../../assets/defaultAvatar.jpg"
import noLike from "../../assets/noLike.svg"
import liked from '../../assets/liked.png'
import comment from '../../assets/addComment.svg'

export default function PostItem({ details }: { details: PostDetails }) {
  const { user, caption, comments, date, imagePath, likes } = details
  const [postOwner, setPostOwner] = useState<currentUser | undefined>()
  const { currentUser } = getAuth()


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
        {imagePath !== '' &&
          <div className="img">
            <img src={imagePath} alt="post Image" width='80%' />
          </div>
        }
        <p className="text">
          {caption}
        </p>
        <div className="reactions">
          <span className="like">
        
              <img src={currentUser != undefined ? likes.includes(currentUser.uid) ? liked : noLike : noLike} alt="like" />
          
            <p>{likes.length > 0 ? likes.length : ''}</p>
          </span>
          <span className="comment">
          
              <img src={comment} alt="comment" />
            
            <p>{comments.length > 0 ? comments.length : ''}</p>
          </span>
        </div>
        {
          comments.length ?
            <div className="commentDisplay">

              {comments.splice(0, comments.length > 3 ? 3 : comments.length).map((commentInfo) => {
                let h: currentUser | undefined;
                (async () => {
                  h = await getUserById(commentInfo.userId)
                })()
                return h != undefined ? (<div key={commentInfo.text + '' + Math.random()} className="commenHint">
                  <img src={postOwner.avatarUrl == "" ? defaultAvatar : postOwner.avatarUrl} alt={postOwner.username} width='50px' height='50px' />
                  <div className="details">
                    <p className="username">{postOwner.username}</p>
                  </div>
                  <div className="comment">
                    <p>{commentInfo.text}</p>
                  </div>
                </div>) : null
              })}
            </div> : null
        }
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
type comment = {
  text: string;
  userId: string;
}