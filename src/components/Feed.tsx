import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { doc, getDoc} from 'firebase/firestore'
import { db } from '../main'
import { useAppSelector } from '../app/hooks'
import PostItem from './FeedComponents/PostItem'

import { PostDetails } from './FeedComponents/PostItem'
import { getUserById } from '../helpers/helpers'

export default function Feed() {
  const {currentUser} = getAuth()
  const [posts, setPost] = useState<PostDetails[]>([])

  useEffect(() => {
    if (currentUser != null&&posts.length==0) {
      (async() => {
        const user = await getUserById(currentUser.uid)
        const mapArr = [currentUser.uid, ...user.following]
        const dataArr: any[] = []
        mapArr.map(async (uid) => {
          const docRef = doc(db, 'post', uid)
          const res = await getDoc(docRef)
          if (res.exists()) {
            const arr = Object.values(res.data())
            if (arr.length) {
              arr.map((data) => {
                dataArr.push(data)
              })
            }
          }
        })
        setPost(posts.concat(dataArr))
      })()
    }
  }, [currentUser])
  return (<>
    {posts.length != 0 ?
      <section className='feed'>
        <h2>feed</h2>
        {
          posts.sort((a,b)=>b.date-a.date).map((item) => (<PostItem key={item.date} details={item}/>)
          )
        }
      </section>
      : <p>follow people to see post...</p>}
  </>)
}

