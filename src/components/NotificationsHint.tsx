import { useEffect, useState } from "react"
import { notification } from "../pages/NotificationList"
import {format} from "date-fns"
import { doc, onSnapshot, setDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "../main"
import { getAuth } from "firebase/auth"
import { getUserById } from "../helpers/helpers"


export default function NotificationHint({id}:{id:string}){
  const [details, setDetails] = useState<notification|undefined>()
  const {currentUser} = getAuth()


  useEffect(()=>{
    let f:() => void = () =>{}
    if(currentUser!=undefined){
      const userRef = doc(db, 'users', currentUser.uid)
      const notifRef = doc(db, 'notifications', id)
      f = onSnapshot(notifRef, (doc)=>{
        let data = doc.data() as notification
        if(doc.exists()){
          (async()=>{
            const user = await getUserById(currentUser.uid)
            if(!data.seen){
              await setDoc(notifRef, {
                seen: true
              }, {merge:true})
              await updateDoc(userRef,{
                unreadNotifications: increment(-1)
              })
            }
          })()
          setDetails(data)
        }
      })
    }
    return f
  },[currentUser])

  return (
    details!=undefined?
    <section className={`${details.seen == false ? "unread Notif" : "Notif"}`} key={details.time}>
      <div>{details.details}</div>
      <div>{format(details.time, 'hh:mm')}</div>
    </section>:null
  )
}