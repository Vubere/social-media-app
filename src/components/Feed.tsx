import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../main'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import PostItem from './FeedComponents/PostItem'

import { PostDetails } from './FeedComponents/PostItem'
import { getUserById } from '../helpers/helpers'

import Loading from './loading'
import { setFeed } from '../slices/feedSlice'

export default function Feed() {
  const { currentUser } = getAuth()
  const [postsIds, setPostsIds] = useState<string[]>([])


  useEffect(() => {
    if (currentUser != null && postsIds.length == 0) {
      (async () => {
        const curUser = await getUserById(currentUser.uid)
        let temp: any[] = [...curUser.posts]
        const mapArr = [...curUser.following]
        if(mapArr.length!=0)
        mapArr.forEach((v) => {
          (async()=>{
            const user = await getUserById(v)
            temp.concat(user.posts)
          })()
        })
        
        setPostsIds(postsIds.concat(temp))  
      })()
    }
  }, [currentUser])
  return (<>
    {postsIds.length != 0 ?
      <section className='feed'>
        {
          postsIds.map((item: string) => {
            return (<PostItem key={item} postId={item} />)
          }
          )
        }
      </section>
      : <Loading />}
  </>)
}

