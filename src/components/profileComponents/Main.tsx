import {useContext} from 'react'
import Header from './Header'
import Feed from './UserPost'

import { profileContext } from '../../pages/Profile'


export default function Main() {
  const userInfo  = useContext(profileContext)

  return (
    userInfo!=undefined?
    <>
      <Header user={userInfo} />
      <Feed user={userInfo} />
    </>:<>user not found</>
  )
} 