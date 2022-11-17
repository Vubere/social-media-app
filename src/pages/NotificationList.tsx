import { format } from 'date-fns'
import { getAuth } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { db } from '../main'
import NotificationHint from '../components/NotificationsHint'
import { useAppSelector } from '../app/hooks'


export default function NotificationsList() {
  const [notificationsArr, setNotifications] = useState<any[]>()
  const {user} = useAppSelector(state=>state.user)
  const { currentUser } = getAuth()

  useEffect(() => {
    let unsub: any = () => { }
    (async () => {
      if (user != null) {
        setNotifications(user.notifications)
        const docRef = doc(db, 'user', user.userID)
        if(user.unreadNotifications>0){
          updateDoc(docRef,{
            unreadNotifications: 0
          })
        }
      }
    })()
    return unsub
  }, [user])
  return (
    <section className='notifications'>
      <header>
        <h2>Notifications</h2>
      </header>
      {
        notificationsArr != undefined ?
          <div className='list'>
            {notificationsArr.length > 0 ?
              notificationsArr.map((id:string) =>
               <NotificationHint key={id} id={id}/>) :
              <p>you have no notification</p>
            }
          </div>
          :
          <p>you have no notification</p>
      }
    </section>
  )
}
export type notification = {
  details: string,
  sender: string,
  seen: boolean,
  time: number,
  type: string
}