import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as routes from '../constants/routes'

import { useAppDispatch } from '../app/hooks'
import { removeUser } from '../slices/userSlice'

import { getAuth, signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../main'

import Avatar from './Avatar'


import defaultAvatar from '../assets/defaultAvatar.jpg'
import home from '../assets/home.png'
import notification from '../assets/notificationIcon.svg'
import logoutIcon from '../assets/logoutIcon.svg'
import messageIcon from '../assets/messageIcon.svg'
import settingIcon from '../assets/settingIcon.svg'

export default function Header() {
  const dispatch = useAppDispatch()
  const [notificationsAmount, setNotificationsAmount] = useState<number>()
  const [messagesAmount, setMessagesAmount] = useState<number>()

  console.log(notificationsAmount, messagesAmount)

  const auth = getAuth()

  const signout = async () => {
    signOut(auth)
    dispatch(removeUser(''))
  }
  useEffect(() => {
    const { currentUser } = auth
    if (currentUser) {
      (() => {
        const docRef = doc(db, 'users', currentUser.uid)
        onSnapshot(docRef, (doc) => {
          let data: any = doc.data()
          if (data) {
            const { unreadNotifications, unReadMessage } = data
            setNotificationsAmount(unreadNotifications)
            setMessagesAmount(unReadMessage)
          }
        })
      })()
    }
  }, [])


  return (
    <>
      {auth.currentUser != null ?
        <header className='navigation'>
          <nav>
            <h1>
              <Link to={routes.dashboard}>
                <img src={home} alt="" className='' width='80%' />
              </Link>
            </h1>
            <Link to={routes.notifications} title='notifications' className='Link notifMess'>
              <span className='count'
              style={{
                'display': `${Number(notificationsAmount)>0?'grid':'none'}`
              }}>{notificationsAmount}</span>
              <img src={notification} alt="" className='' width='80%' />
            </Link>
            <Link to={routes.messages} title='messages' className='Link notifMess'>
              <span className='count'
                style={{
                  'display': `${Number(messagesAmount) > 0 ? 'grid' : 'none'}`
                }}>{messagesAmount}</span>
              <img src={messageIcon} alt="" className='' width='80%' />
            </Link>
            <Link to={routes.settings} title='settings' className='Link'>
              <img src={settingIcon} alt="" className='' width='80%' />

            </Link>
            <Link to={routes.login} title='sign out' className='Link' onClick={async () => await signout()}>
              <img src={logoutIcon} alt="" className='logOutImg' width='80%' />
            </Link>
            <Link to={`${routes.profile}/${auth.currentUser.displayName}`} title='profile' className='Link'
            >
              <div className="homeImg">

                <Avatar id={auth.currentUser.uid} />
              </div>
            </Link>
          </nav>
        </header> :
        null
      }
    </>
  )
}