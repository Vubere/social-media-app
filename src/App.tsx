import { useEffect, useState } from 'react'

import { Outlet } from 'react-router-dom'

import Header from './components/NavigationBar'
import './styles/app.scss'




import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getUserById } from './helpers/helpers'
import { useAppDispatch } from './app/hooks'
import userSlice, { removeUser, updateUser } from './slices/userSlice'
import { useNavigate } from "react-router-dom"
import * as routes from "./constants/routes"

function App() {
  const auth = getAuth()
  const { currentUser } = auth
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(currentUser!=null){
      navigate('/home')
    }else{
      navigate('/login')
    }
    onAuthStateChanged(auth, async (user) => {
      if (user != null) {
        localStorage.setItem('currentuser', JSON.stringify(user))
        const userDetails = await getUserById(user.uid)
        dispatch(updateUser(userDetails))
        navigate('/home')
      } else {
        navigate(routes.login)
        localStorage.removeItem('currentuser')
        dispatch(removeUser(''))
        navigate('/login')
        console.log('signedout')
      }
    })()

  }, [currentUser, auth])

  return (
    <div className="App">
      <Header />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  )
}

export default App
