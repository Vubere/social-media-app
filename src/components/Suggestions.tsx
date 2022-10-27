import { User } from 'firebase/auth'
import {useEffect, useState} from 'react'
import { useAppSelector } from '../app/hooks'

import { getSuggestions } from "../helpers/helpers"
import useUserDetails from '../hooks/useUser'
import { currentUser } from './profileComponents/Header'
import UserHint from './UserHint'


export default function Suggestion() {
  const {user} = useAppSelector<{user:currentUser|null}>(state=>state.user)
  const [currentUser] = useUserDetails(user?.username as string)
  const [suggestions, setSuggestions] = useState<currentUser[]>([])
  
  useEffect(()=>{
    (async ()=>{
    
      if(currentUser!=undefined){
        const h = await getSuggestions(currentUser)
        setSuggestions(h)
      }
    })()
  }, [currentUser])
  return (
   currentUser!=null?
  <div className="suggestions">
    {suggestions.length?
    suggestions.map((data)=><UserHint key={user?.userID} user={data}/>):
    <div>No suggestions</div>}
  </div>: null
  )
}