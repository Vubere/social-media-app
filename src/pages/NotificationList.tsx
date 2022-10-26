import { format } from 'date-fns'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import {useState, useEffect} from 'react'
import { getUserById } from '../helpers/helpers'
import { db } from '../main'


export default function NotificationsList(){
  const [notifications, setNotifications] = useState<notification[]>()
  const {currentUser} = getAuth()
  
  useEffect(()=>{
    (async()=>{
      if(currentUser!=null){
        const docRef = doc(db, 'notifications', currentUser.uid)
        const res = await getDoc(docRef)
        if(res.exists()){
          let arr = [], data = res.data()
          const sender = await getUserById(data.sender)
          for(let i in data){
            if(typeof data[i]!= 'number'){
              arr.push(data[i])
            }
          }
          setNotifications(arr)
        }
      }
    })()
  },[currentUser])
  return (
    <>
        <header>
          <h2>Notifications</h2>
        </header>
    {
      notifications!=undefined?
      <>
    {notifications.length>0?
    notifications.sort((a,b)=>b.time-a.time).map((list)=>
      <section className={`${list.seen==false?"unread Notif":"Notif"}`} key={list.time}>
        <div>{list.details}</div>
        <div>{format(list.time,'hh:mm')}</div>
      </section>):
      <p>you have no notification</p>
      }
    </>
    :
    <p>you have no notification</p>
  }
</>
  )
}
type notification = {
  details: string,
  sender: string,
  seen: boolean,
  time: number,
  type: string
}