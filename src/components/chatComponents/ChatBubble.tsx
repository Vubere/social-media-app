import { currentUser } from "../profileComponents/Header";
import { format } from "date-fns"

import defaultAvatar from '../../assets/defaultAvatar.jpg'

export default function Chatbubble({ message, document, time, person, className }: Chatbubble) {


  return (
    <section className={className}>
      <div className="avatar">
        <img src={person.avatarUrl==''?defaultAvatar:person.avatarUrl} alt="avatar" width="30px" />
        <p className="username">{person.username}:</p>
      </div>
      {document != '' ?
        <img src={document} alt='document' width='200px' /> :
        null}
      <p>{message}</p>
      <div className="time">
        <p>{format(Number(time), "HH:mm")}</p>
      </div>
    </section>
  )
}

type Chatbubble = {
  message: string;
  document: string;
  time: string;
  person: currentUser;
  className: string;
}