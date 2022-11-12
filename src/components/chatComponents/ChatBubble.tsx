import { useRef, useEffect } from "react";

import { currentUser } from "../profileComponents/Header";
import { format, formatDistance, formatRelative, subDays } from "date-fns"
import { getAuth } from "firebase/auth";

import Avatar from "../Avatar";

export default function Chatbubble({ message, doc, time, person, className, d, e }: Chatbubble) {
  const { currentUser } = getAuth()


  useEffect(() => {

    if (d.i == d.j) {
      if (e.current != undefined) {
        e.current.scrollIntoView(true)
      }
    }
  }, [])

  return (<div>
    {
      currentUser != null &&
      <>
        <section className={className} ref={d.i == d.j ? e : undefined}>
          {currentUser.uid != person.userID && <div className="avatar">
            <Avatar id={person.userID}/>
          </div>}
          <div className="message">
            {doc != '' ?
              <img src={doc} alt='document' width='200px' height='250px'/> :
              null}
            <p>{message}</p>
            <div className="time" >
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
  doc: string;
  time: string;
  person: currentUser;
  className: string;
  d: {
    i: number;
    j: number;
  };
  e: React.MutableRefObject<any>
}