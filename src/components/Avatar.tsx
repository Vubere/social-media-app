import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../main"


import avatar from '../assets/defaultAvatar.jpg'


export default function Avatar({id}:{id?:string}){
  const [imageSrc, setImageSrc] = useState('')
  useEffect(()=>{
    if(id!=undefined){
      const docRef = doc(db, 'users', id)
      const unsubscribe = onSnapshot(docRef, (doc)=>{
        const data = doc.data()
        if(data!=undefined){
          if(imageSrc!=data.avatarUrl){
            setImageSrc(data.avatarUrl)
          }
        }
      })
    }
    
  },[id])

  return(
    <img src={imageSrc||avatar} alt="profile owner" />
  )
}