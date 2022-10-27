import { format } from 'date-fns'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import {useState, useEffect} from 'react'
import { getUserById } from '../helpers/helpers'
import { db } from '../main'


export default function NotificationsList(){
  const [notifications, setNotifications] = useState<notification[]>()
  const [unread, setUnread] = useState(0)
  const {currentUser} = getAuth()
  
  useEffect(()=>{
    let unsub:any = () => {}
    (async()=>{
      if(currentUser!=null){
        const docRef = doc(db, 'notifications', currentUser.uid)
        unsub = onSnapshot(docRef,async(res)=>{
          const data = res.data()
          if(data!=undefined){
            let temp = []
            for(let i in data){
              if(typeof data[i]!='number'){
                temp.push(data[i])
              }
            }
            setNotifications(temp)
          }
        })
      }
    })()
    return unsub
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