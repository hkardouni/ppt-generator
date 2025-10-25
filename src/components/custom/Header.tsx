import logo from '@/assets/logo.png'
import { Button } from '../ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
const Header = () => {

    const { user } = useUser()
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
                    <Link to='/workspace'>
                        <Button>Go to Workspace</Button>
                    </Link>
                </div>
                : <SignInButton mode='modal'>
                    <Button>Get Started</Button>
                </SignInButton>}
        </div>
    )
}

export default Header
