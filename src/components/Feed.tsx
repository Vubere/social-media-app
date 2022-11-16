import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../main'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import PostItem from './FeedComponents/PostItem'

import { getUserById } from '../helpers/helpers'

import Loading from './loading'


export default function Feed() {
  const {user} = useAppSelector(state=>state.user)
  const [postsIds, setPostsIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user!=null&&postsIds.length==0) {
      (async () => {
        let temp: any[] = [user.userID, ...user.following]
        let arr: any[] = []   
        
        temp.forEach((v, i) => {
          (async()=>{ 
            const user = await getUserById(v)
            arr.push(...user.posts)
            if(temp.length-1==i){
              setPostsIds(arr)
            }
          })()
        })
        
        setLoading(false)  
      })()
    }
  }, [user])
  
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

