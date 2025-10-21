import logo from '@/assets/logo.png'
import { Button } from '../ui/button'
const Header = () => {
  return (
    <div className='flex items-center justify-between px-10 shadow'>
      <img src={logo} width={130} height={130} alt='logo'/>
      <Button>Get Started</Button>
    </div>
  )
}

export default Header
