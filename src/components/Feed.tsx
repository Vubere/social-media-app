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


  const dispatch = useAppDispatch()
  const {feed}:{feed:PostDetails[]|[]} = useAppSelector<{feed:PostDetails[]|[]}>(state => state.feed)


  useEffect(() => {
    if (currentUser != null && feed.length == 0) {
      (async () => {
        let temp: any = []
        const user = await getUserById(currentUser.uid)
        const mapArr = [currentUser.uid, ...user.following]
        mapArr.forEach((v, j) => {
          const docRef = doc(db, 'post', v)
          onSnapshot(docRef, (doc) => {
            let data = doc.data()

            if (data != undefined) {
              let arr = Object.values(data)
              for (let i in arr) {
                if (typeof arr[i] != 'number')
                  temp.push(arr[i])
                if (Number(j) == mapArr.length - 1) {
                  dispatch(setFeed(temp))
                }
              }
            }
          })
        })
      })()
    }
  }, [currentUser])
  return (<>
    {feed.length != 0 ?
      <section className='feed'>
        {
        feed.map((item:PostDetails) => {
            return (<PostItem key={item.date} details={item} />)
          }
          )
        }
      </section>
      : <Loading />}
  </>)
}

