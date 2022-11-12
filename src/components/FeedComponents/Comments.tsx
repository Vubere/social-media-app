import { comment, PostDetails } from "./PostItem";
import CommentHint from "./CommentHint";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Comments({postDetails, postId, length}:{postDetails:PostDetails, postId:string, length:number}){

  const [comments, setComments] = useState<comment[]>()

  useEffect(()=>{
    const comArr:comment[] = Object.values(postDetails.comments)
    setComments(comArr)
  },[])

  return (<>
    {
      comments!=undefined ?
      <div className="commentDisplay">

          {comments.sort((a, b) => b.date - a.date).slice(0, postDetails.comments.length > 3 ? 3 : postDetails.comments.length).map((commentInfo) => <CommentHint id={postId} commentInfo={commentInfo}
            key={commentInfo.comment + '' + Math.random()} />)}
          <Link to={`/post/${postId}/comments`}>See comments...</Link>
        </div> : <div className="noComments">no comments...</div>
    }
    </>
  )
}