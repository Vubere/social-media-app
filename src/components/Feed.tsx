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
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (currentUser != null && postsIds.length == 0) {
      (async () => {
        const curUser = await getUserById(currentUser.uid)
        let temp: any[] = [...curUser.posts]
        
        curUser.following.forEach((v, i) => {
          (async()=>{ 
            const user = await getUserById(v)
            temp.push(...user.posts)
            if(curUser.following.length-1==i){
              setPostsIds(temp)
            }
          })()
        })
        
      
        setLoading(false)  
      })()
    }
  }, [currentUser])
  return (<>
    {!loading?postsIds.length != 0 ?
      <section className='feed'>
        {
          postsIds.sort((a:any,b:any)=>{
            let d1 = a.slice(a.length-10, a.length)
            let d2 = b.slice(b.length-10, b.length)
            return Number(d2-d1)
          }).map((item: string) => {
            return (<PostItem key={item} postId={item} />)
          }
          )
        }
      </section>:<div>no post to display</div>
      : <Loading />}
  </>)
}

