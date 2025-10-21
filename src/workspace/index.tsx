import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Workspace = () => {

  const { user } = useUser()

  if (!user) {
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
