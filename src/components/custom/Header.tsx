import logo from '@/assets/logo.png'
import { Button } from '../ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useLocation } from 'react-router-dom'
import { Gem } from 'lucide-react'
import { useContext } from 'react'
import { UserDetailContext } from '../../../context/UserDetailContext'
const Header = () => {

    const { user } = useUser()
    const location = useLocation()
    const {userDetail} = useContext(UserDetailContext)

    console.log(location.pathname)
    return (
        <div className='flex items-center justify-between px-10 shadow'>
            <img src={logo} width={130} height={130} alt='logo' />
            {user ?
                <div className='flex items-center gap-2'>
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonAvatarBox: 'w-10 h-10'
                            }
                        }} />
                    {location.pathname.includes('workspace') ?
                        <div className='flex gap-2 items-center bg-blue-100 rounded-full p-2 px-3'>
                            <Gem />
                            {
                                userDetail?.credits ?? 0
                            }
                        </div>
                        : <Link to='/workspace'>
                            <Button>Go to Workspace</Button>
                        </Link>
                    }
                </div>
                : <SignInButton mode='modal'>
                    <Button>Get Started</Button>
                </SignInButton>}
        </div>
    )
}

export default Header
