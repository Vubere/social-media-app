import { getAuth, User } from 'firebase/auth'
import {useEffect, useState} from 'react'
import { useAppSelector } from '../app/hooks'

import { getSuggestions, getUserById } from "../helpers/helpers"
import useUserDetails from '../hooks/useUser'
import { currentUser } from './profileComponents/Header'
import UserHint from './UserHint'


export default function Suggestion() {
  const [suggestions, setSuggestions] = useState<currentUser[]>([])
  const {currentUser} = getAuth()
  const [user, setUser] = useState<currentUser|undefined>()
  
  useEffect(()=>{
    (async ()=>{
      if(currentUser!=null){
        const userDetails = await getUserById(currentUser.uid)
       
        const s = await getSuggestions(userDetails)
        setSuggestions(s)
        setUser(userDetails)
      }
    })()
  }, [currentUser])
  return (
   user!=undefined?
  <div className="suggestions">
    {suggestions.length?
    suggestions.map((data)=><UserHint key={user?.userID} user={data}/>):
    <div>No suggestions</div>}
  </div>: null
  )
}