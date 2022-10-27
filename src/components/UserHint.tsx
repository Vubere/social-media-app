import { doc, setDoc, collection, arrayUnion } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {useState, useEffect} from 'react' 
import {Link} from 'react-router-dom'
import { currentUser } from "./profileComponents/Header"

import { sendNotification, toggleFollowAUser } from '../helpers/helpers'
import useUserDetails from '../hooks/useUser'

import defaultAvatar from '../assets/defaultAvatar.jpg'

export default function UserHint({user}:{user:currentUser}){
  const [following, setFollowing] = useState<boolean>(false)
  const [userDetails] = useUserDetails(getAuth().currentUser?.displayName as string)
  
  const follow = async (e:React.FormEvent) => {
    e.preventDefault()
    if(!following){
      sendNotification('followed', user.userID,userDetails.userID, `${userDetails.username} followed you.`)
    }
    toggleFollowAUser(
      user,
      setFollowing,
      following
    )
  }
  useEffect(()=>{
    if(userDetails){
      if(userDetails.following.includes(user.userID))
      setFollowing(true)
      
    }
  },[userDetails])


  return (
    <div className="userHint">
      <Link to={`profile/${user.username}`}>
      <img src={user.avatarUrl!=''?user.avatarUrl:defaultAvatar} alt={user.username} />
      </Link>
      <Link to={`/profile/${user.username}`}>
      <div className="name">
        <div className="fullname">
          {user.fullName}
        </div>
        <div className="username">
          @{user.username}
        </div>
      </div>
      </Link>
      <button onClick={(e)=>follow(e)}
      className='followButton'>
        {following?'unfollow':'follow'}
      </button>
    </div>
  )
}