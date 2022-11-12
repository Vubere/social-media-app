import { useEffect, useState } from "react";


import { formatRelative, subDays } from "date-fns";

import { currentUser } from "../profileComponents/Header";

import { getUserById } from "../../helpers/helpers";

import Avatar from "../Avatar";
import CommentReaction from "./CommentReaction";

import { comment } from "./PostItem";


import { Link } from "react-router-dom";

export default function CommentHint({ commentInfo, id }: { commentInfo: comment, id: string }) {
  const [h, setH] = useState<currentUser | undefined>()
 
  const [commenter, setCommenter] = useState<string>()
  


  
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
      {h != undefined &&commenter!=undefined ? (<div className="commentHint">
        <div className="main">
          <div className="details">
            <div className="user">
              <Avatar id={h.userID}/>
              <Link to={`/profile/${commenter}`} className="username">{h.username}</Link>
            </div>
            <div className="comment">
              <p>{commentInfo.comment}</p>
            </div>
          </div>
          <CommentReaction commentInfo={commentInfo} id={id}/>
        </div>
        <div className="date">
          {formatRelative(subDays(Number(commentInfo.date), 0), new Date())}
        </div>
      </div>) : null}

    </>
  )
}