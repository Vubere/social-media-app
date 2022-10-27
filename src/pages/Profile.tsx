import { createContext, useEffect } from 'react'
import { setReceiver } from '../slices/chatSlice'
import { useParams, Outlet } from 'react-router-dom'

import useUserDetails from "../hooks/useUser"
import { currentUser } from '../components/profileComponents/Header'


export const profileContext = createContext<currentUser | undefined>(undefined)

export default function Profile() {
  const { username } = useParams()
  const [userInfo] = useUserDetails(username as string)


  return (
    <section className='profile'>
      {
        userInfo !== undefined ?
          <>
            <profileContext.Provider value={userInfo} >
              <Outlet />
            </profileContext.Provider>
          </> :
          <div className="notFound">user not found</div>
      }
    </section>
  )
}
