import { PostDetails } from "./PostItem";
import CommentHint from "./CommentHint";
import { Link } from "react-router-dom";

export default function Comments({postDetails, postId, length}:{postDetails:PostDetails, postId:string, length:number}){
  return (<>
    {
      postDetails.comments.length ?
      <div className="commentDisplay">

          {postDetails.comments.sort((a, b) => b.date - a.date).slice(0, postDetails.comments.length > 3 ? 3 : postDetails.comments.length).map((commentInfo) => <CommentHint commentInfo={commentInfo}
            key={commentInfo.comment + '' + Math.random()} />)}
          <Link to={`/post/${postId}/comments`}>See comments...</Link>
        </div> : <div className="noComments">no comments...</div>
    }
    </>
  )
}