import { getAuth } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { toggleFollowAUser } from '../../helpers/helpers'
import { Link, useNavigate } from 'react-router-dom'
import * as routes from '../../constants/routes'
import { useAppDispatch } from '../../app/hooks'
import { setReceiver } from '../../slices/chatSlice'
import { sendNotification } from '../../helpers/helpers'
import useUserDetails from '../../hooks/useUser'

import defaultAvatar from '../../assets/defaultAvatar.jpg'

export default function Header({ user }: { user: currentUser }) {
  const [following, setFollowing] = useState<boolean>(false)
  const { currentUser } = getAuth()
  const [userDetails] = useUserDetails(getAuth().currentUser?.displayName as string)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()



  const follow = async (e: React.FormEvent) => {
    e.preventDefault()

    toggleFollowAUser(
      user,
      setFollowing,
      following
    )
    if (!following) {
      sendNotification('followed', user.userID, userDetails.userID, `${userDetails.username} followed you.`)
    }

  }
  const message = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setReceiver(user))
    navigate(`/chat/${user.username}`)
  }

  useEffect(() => {
    if (user) {
      if (userDetails)
        if (user.followers.includes(userDetails.userID))
          setFollowing(true)
    }
  }, [user])


  return (
    <div className="profileHeader">
      <div className="image">
        <img src={user.avatarUrl==''?defaultAvatar:user.avatarUrl} alt={user.username} />
      </div>
      <section className="details">
        <div className="userinfo">
          <div className="fullname">
            {user.fullName}
          </div>
          <div className="username">
            @{user.username}
          </div>
        </div>
        <div className="userSocial">
          <Link to={routes.profile + '/' + user.username + '/' + routes.mutuals}>see connections</Link>
          <div className="followers">
            followers:{user.followers.length}
          </div>
          <div className="following" onClick={() => {

          }}>
            following:{user.following.length}
          </div>
        </div>
      </section>
      {
        user.userID != currentUser?.uid&&userDetails ?
          <section className="interact">
            <div className="followbutton">
              <button type="button"
                aria-label="follow or unfollow user"
                onClick={(e) => follow(e)}>
                {following ? 'unfollow' : 'follow'}
              </button>
            </div>
            <div className="message">
              <button
                aria-label='send a message'
                onClick={(e) => message(e)}>
                message
              </button>
            </div>
          </section> :
          <div className="editProfile">
            <Link to={routes.profile + '/' + user.username + '/' + routes.editProfile}>

              <button className='editButton'
                aria-label='edit button'
              >
                editProfile
              </button>
            </Link>
          </div>
      }
    </div>
  )
}

export type currentUser = {
  username: string,
  avatarUrl: string,
  fullName: string,
  followers: string[],
  following: string[],
  dateCreated: string,
  email: string,
  userID: string,
}
