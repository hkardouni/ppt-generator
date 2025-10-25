import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { Link, Outlet } from 'react-router-dom'
import { firebaseDb } from '../../config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useContext, useEffect } from 'react'
import { UserDetailContext } from '../../context/UserDetailContext'
const Workspace = () => {

  const { user, isLoaded } = useUser()
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  useEffect(() => {
    CreateNewUser()
  }, [user])

  const CreateNewUser = async () => {
    if (user) {
      const docRef = doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress ?? '')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log(docSnap.data())
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
      Workspace
      <Outlet />
    </div>
  )
}

export default Workspace
