
import Feed from '../components/Feed'
import SendPost from '../components/SendPost'
import Suggestion from '../components/Suggestions'


export default function Dashboard() {

  return (

    <div className="dashboard">
      <header>
        <h2>Home</h2>
      </header>
      <div className="dashboardBody">
        <SendPost />
        <Suggestion />
        <Feed />
      </div>
    </div>
  )
}