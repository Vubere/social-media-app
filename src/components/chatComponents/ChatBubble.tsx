import { currentUser } from "../profileComponents/Header";
import { format, formatDistance, formatRelative, subDays } from "date-fns"
import { getAuth } from "firebase/auth";

import defaultAvatar from '../../assets/defaultAvatar.jpg'

export default function Chatbubble({ message, document, time, person, className }: Chatbubble) {
  const { currentUser } = getAuth()

  return (<div>
    {
      currentUser != null &&
      <>
        <section className={className}>
          {currentUser.uid != person.userID && <div className="avatar">
            <img src={person.avatarUrl == '' ? defaultAvatar : person.avatarUrl} alt="avatar" width="30px" />
          </div>}
          <div className="message">
            {document != '' ?
              <img src={document} alt='document' width='200px' /> :
              null}
            <p>{message}</p>
            <div className="time">
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
}