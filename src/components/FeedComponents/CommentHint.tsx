import { useEffect, useState } from "react";

import { formatRelative, subDays } from "date-fns";

import { currentUser } from "../profileComponents/Header";

import { getUserById } from "../../helpers/helpers";

import { comment } from "./PostItem";

import defaultAvatar from "../../assets/defaultAvatar.jpg"

export default function CommentHint({commentInfo}:{commentInfo:comment}) {
  const [h, setH] = useState<currentUser|undefined>()

  useEffect(()=>{
    (async () => {
      let u = await getUserById(commentInfo.userId)
      setH(u)
    })()
  },[])

  return (
    <>
      {h != undefined ? (<div  className="commenHint">
        <img src={h.avatarUrl == "" ? defaultAvatar : h.avatarUrl} alt={h.username} width='50px' height='50px' />
        <div className="details">
          <p className="username">{h.username}</p>
        </div>
        <div className="comment">
          <p>{commentInfo.comment}</p>
        </div>
        <div className="date">
          {formatRelative(subDays(Number(commentInfo.date), 0), new Date())}
        </div>
      </div>) : null}

    </>
  )
}