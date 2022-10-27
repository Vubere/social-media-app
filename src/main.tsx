import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as  routes from './constants/routes'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from 'firebase/storage'

import { Provider } from 'react-redux'
import { store } from './app/store'

import ErrorBoundary from './pages/ErrorBoundary';


const firebaseConfig = {
  apiKey: "AIzaSyD3fhcggjclSR-SgTthsiyUZ7ZeYs_rdAw",
  authDomain: "vuinstagram123.firebaseapp.com",
  projectId: "vuinstagram123",
  storageBucket: "vuinstagram123.appspot.com",
  messagingSenderId: "786350061445",
  appId: "1:786350061445:web:41746f4433202f884976ec",
  measurementId: "G-X865Z1LFJ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

import { profileContext } from './pages/Profile';

const App = lazy(() => import('./App'))
const Main = lazy(() => import('./components/profileComponents/Main'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const EditProfile = lazy(() => import('./components/profileComponents/EditProfile'))
const FollowPage = lazy(() => import('./components/profileComponents/FollowPage'))
const NoMatch = lazy(() => import('./pages/NoMatch'))
const Messages = lazy(() => import('./pages/Messages'))
const Chat = lazy(() => import('./pages/Chat'))
const Notifications = lazy(() => import('./pages/NotificationList'))


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>

      <Suspense fallback={<div>loading...</div>}>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<App />}>
                <Route index path={routes.dashboard} element={<Dashboard />} />
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.signup} element={<Signup />} />
                <Route path={routes.messages} element={<Messages />} />
                <Route path={routes.notifications} element={<Notifications />} />
                <Route path={`${routes.chats}/:username`} element={<Chat />} />
                <Route path={`${routes.profile}/:username`} element={<Profile />}>
                  <Route index element={<Main />} />
                  <Route path={routes.editProfile} element={<EditProfile />} />
                  <Route path={routes.mutuals} element={<FollowPage />} />
                </Route>
                <Route path='*' element={<NoMatch />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </Suspense>
    </React.StrictMode>
  </Provider>
)

/* 
Todo:
restrict the user from certain parts if user is not login, i.e
the user can view a profile but can't follow
*/
