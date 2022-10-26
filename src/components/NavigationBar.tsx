import { getAuth, signOut } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'

import { useNavigate } from 'react-router-dom'

import * as routes from '../constants/routes'
import { removeUser } from '../slices/userSlice'

import defaultAvatar from '../assets/defaultAvatar.jpg'
import home from '../assets/home.png'
import notification from '../assets/notificationIcon.svg'
import logoutIcon from '../assets/logoutIcon.svg'
import messageIcon from '../assets/messageIcon.svg'
import settingIcon from '../assets/settingIcon.svg'

export default function Header() {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const auth = getAuth()

  const signout = async () => {
    signOut(auth)

    dispatch(removeUser(''))
  }
  return (
    <>
      {auth.currentUser != null ?
        <header className='navigation'>
          <nav>
            <h1>
              <Link to={routes.dashboard}>
                <img src={home} alt="" className='homeImg' width='80%' />
              </Link>
            </h1>
            <Link to={routes.notifications} title='notifications' className='Link'>
                <img src={notification} alt="" className='homeImg' width='80%' />
            </Link>
            <Link to={routes.messages} title='messages' className='Link'>
                <img src={messageIcon} alt="" className='homeImg' width='80%' />
            </Link>
            <Link to={routes.settings} title='settings' className='Link'>
                <img src={settingIcon} alt="" className='homeImg' width='80%' />
              
            </Link>
            <Link to={routes.login} title='sign out' className='Link' onClick={async () => await signout()}>
                <img src={logoutIcon} alt="" className='logOutImg' width='80%' />
            </Link>
            <Link to={`${routes.profile}/${auth.currentUser.displayName}`} title='profile' className='Link'
              onClick={() => navigate(routes.profile)}>
                <img src={auth.currentUser.photoURL!=null&&auth.currentUser.photoURL!=''?auth.currentUser.photoURL:defaultAvatar} alt="" className='homeImg' width='30px' 
                height="30px"
                style={{
                  "borderRadius":"50%"
                }}/>
            </Link>
          </nav>
        </header> :
        null
      }
    </>
  )
}