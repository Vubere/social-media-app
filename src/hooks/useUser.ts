import {useState, useEffect} from 'react'

import { User } from "firebase/auth"
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../main'

import { currentUser } from '../components/profileComponents/Header'

export default function useUserDetails(user:string):currentUser[]{
  const [userDetails, setUserDetails] = useState<any>()
  useEffect(()=>{
    const run = async ()=>{
      const getUserDetails = async (user:string) => {
        if(user==undefined) return
        const q = query(collection(db, 'users'), where('username', '==', user))
        
        const s = onSnapshot(q,(doc)=>{
          doc.forEach(data=> setUserDetails(data.data()))
        })
        
      }
      await getUserDetails(user)
    }
    run()
  }, [user])
  return [userDetails]
}