import { format } from 'date-fns'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { getUserById } from '../helpers/helpers'
import { db } from '../main'
import NotificationHint from '../components/NotificationsHint'


export default function NotificationsList() {
  const [notificationsArr, setNotifications] = useState<any[]>()
  const [unread, setUnread] = useState(0)
  const { currentUser } = getAuth()

  useEffect(() => {
    let unsub: any = () => { }
    (async () => {
      if (currentUser != null) {
        const {notifications} = await getUserById(currentUser.uid)
        setNotifications(notifications)
      }
    })()
    return unsub
  }, [currentUser])
  return (
    <section className='notifications'>
      <header>
        <h2>Notifications</h2>
      </header>
      {
        notificationsArr != undefined ?
          <div className='list'>
            {notificationsArr.length > 0 ?
              notificationsArr.sort((a, b) => b.time - a.time).map((id:string) =>
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