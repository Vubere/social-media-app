import { getAuth } from 'firebase/auth'
import { collection, getDoc, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../main'
import { currentUser } from './Header'

export default function Feed({user}:{user:currentUser}) {
  const [postList, setPostList] = useState<postLis|[]>([])

  useEffect(() => {
    (async () => {
      
        const docRef = doc(db, 'post', user.userID)
        const ref = await getDoc(docRef)
        const post: any = ref.data()
        const arr = []
        for(let val in post){
          arr.push(post[val])
        } 
        setPostList(arr)

    })()
  }, [])
  return (
    <div className="userUploads">
      {postList.length? <>
        {postList.map((data)=>
          <div key={data.caption} className='postItem'>
            {
              data.imagePath.length!==0&&
            <img src={data.imagePath} alt={data.caption} className='post img'/>
            }
            <p className="caption">
              {data.caption}
            </p>
          </div>)
        }
      </> : <div className='userPost'>no post available</div>}
    </div>
  )
}
type postLis = {
  comments: any[],
  caption:"hello",
  date:number,
  imagePath:string,
  likes:any[]
}[]