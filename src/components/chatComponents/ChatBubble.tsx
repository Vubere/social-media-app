import { useRef, useEffect } from "react";

import { currentUser } from "../profileComponents/Header";
import { format, formatDistance, formatRelative, subDays } from "date-fns"
import { getAuth } from "firebase/auth";

import defaultAvatar from '../../assets/defaultAvatar.jpg'

export default function Chatbubble({ message, document, time, person, className, d , e}: Chatbubble) {
  const { currentUser } = getAuth()
  

  useEffect(() => {
    if (d) {
      if (d.i - d.j == 0) {
        if (e.current != undefined) {
          e.current.focus()
        }
      }
    }
  }, [])

  return (<div>
    {
      currentUser != null &&
      <>
        <section className={className} >
          {currentUser.uid != person.userID && <div className="avatar">
            <img src={person.avatarUrl == '' ? defaultAvatar : person.avatarUrl} alt="avatar" width="30px" />
          </div>}
          <div className="message">
            {document != '' ?
              <img src={document} alt='document' width='200px' /> :
              null}
            <p>{message}</p>
            <div className="time" ref={e}>
              <p>{formatRelative(subDays(Number(time), 0), new Date())}</p>
            </div>
          </div>
        </section>
      </>}
  </div>
  )
}

type Chatbubble = {
  message: string;
  document: string;
  time: string;
  person: currentUser;
  className: string;
  d: {
    i: number;
    j: number;
  };
  e: React.MutableRefObject<any>
}