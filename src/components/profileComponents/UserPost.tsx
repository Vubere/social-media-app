
import { getDoc, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../main'
import { currentUser } from './Header'
import PostItem from '../FeedComponents/PostItem'


import { PostDetails } from '../FeedComponents/PostItem'

export default function Feed({ user }: { user: currentUser }) {
  const [postList, setPostList] = useState<PostDetails[] | []>([])

  useEffect(() => {
    (async () => {

      const docRef = doc(db, 'users', user.userID)
      const ref = await getDoc(docRef)
      const post: any = ref.data()
      const arr = []
      for (let val in post) {
        arr.push(post[val])
      }
      setPostList(arr)
    })()
  }, [user])
  return (
    <div className="userUploads">
      {postList.length ? <>
        {user.posts.map((id:string) =>
          <PostItem key={id+'p'} postId={id} />)
        }
      </> : <div className='userPost'>no post available</div>}
    </div>
  )
}
