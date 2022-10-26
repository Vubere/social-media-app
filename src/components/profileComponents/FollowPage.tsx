import { useState, useEffect, useContext } from 'react'
import {Link} from 'react-router-dom'
import { getUserById } from '../../helpers/helpers'

import { currentUser } from "./Header"
import UserHint from "../UserHint"
import { profileContext } from '../../pages/Profile'

import * as routes from "../../constants/routes"


export default function FollowPage() {
  const [followData, setFollowData] = useState<currentUser[]>([])
  const userInfo = useContext(profileContext)
  const [type, setType] = useState<'following' | 'followers'>('followers')

  useEffect(() => {
    if(userInfo==undefined) return
    if (type == 'followers') {
      userInfo.followers.forEach(async (id: string) => {
        const d = await getUserById(id)
        setFollowData(prev => [...prev, d])
      })
    } else {
      userInfo.following.forEach(async (id: string) => {
        const d = await getUserById(id)
        setFollowData(prev => [...prev, d])
      })
    }
  }, [userInfo, type])
  return (
    userInfo!=undefined?
    <>
      <div className="title">
        <h2 onClick={() => {
          if (type == 'following') return
          setFollowData([])
          setType('following')
        }}>{type === 'following' ?
          <>
                <Link to={`${routes.profile}/${userInfo.username}`}>
              {`${userInfo.username} `}
            </Link>
             is following
          </>
          : 'see following'}</h2>
        <h2 onClick={() => {
          if (type == 'followers') return
          setFollowData([])
          setType('followers')
        }}>{type === 'followers' ? 
            <>
              <Link to={`${routes.profile}/${userInfo.username}`}>
                {`${userInfo.username}'s `}
              </Link>
              followers
            </>
         : 'see followers'}</h2>
      </div>
      {followData.length !== 0 ?
        followData.map((data) => <UserHint user={data} />) :
        <div className="none">
          {
            <div className="none">
              {type == 'followers' ?
                'no followers' :
                'not following anyone'}
            </div>
          }
        </div>
      }
    </>:<></>
  )
}