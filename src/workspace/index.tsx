import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { firebaseDb } from '../../config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useContext, useEffect } from 'react'
import { UserDetailContext } from '../../context/UserDetailContext'
import Header from '@/components/custom/Header'
import PromptBox from '@/components/custom/PromptBox'
import MyProjects from '@/components/custom/MyProjects'
const Workspace = () => {

  const { user, isLoaded } = useUser()
  const { userDetail, setUserDetail } = useContext(UserDetailContext)

  const location = useLocation()

  useEffect(() => {
    CreateNewUser()
  }, [user])

  const CreateNewUser = async () => {
    if (user) {
      const docRef = doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress ?? '')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setUserDetail(docSnap.data())
      } else {
        const data = {
          fullName: userDetail?.fullName,
          email: userDetail?.primaryEmailAddress?.emailAddress,
          createdAt: new Date(),
          credit: 2
        }
        await setDoc(doc(firebaseDb, "users", userDetail?.primaryEmailAddress?.emailAddress ?? ''), {
          ...data
        })
        setUserDetail(data)
      }
    }

  }
  if (!user && isLoaded) {
    return (
      <div className='flex flex-col gap-5 items-center justify-center mt-28'>
        <h1 className='text-2xl font-bold text-red-400'>Please sign in to access this page.</h1>
        <Link to='/'>
          <Button>Back to HomePage</Button>
        </Link>
      </div>
    )
  }
  return (
    <div>
      <Header />
      {
        location.pathname === '/workspace' &&
        <div>
          <PromptBox />
          <MyProjects />
        </div>
      }
      <Outlet />
    </div>
  )
}

export default Workspace
