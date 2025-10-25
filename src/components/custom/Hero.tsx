import { Button } from '../ui/button'
import { Video } from 'lucide-react'
import { HeroVideoDialog } from '../ui/hero-video-dialog'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Hero = () => {

    const { user } = useUser()

    return (
        <div className='flex flex-col items-center justify-center mt-28 space-y-2'>
            <h2 className='typing-header text-5xl font-bold'>Turn <span className='text-primary'> Idea</span> to <span className='text-primary'>Presentation</span> in One Click</h2>
            <p className='text-gray-500 text-xl max-w-xl text-center'>Generate editable AI-powered PPTs. Save hours on design and focus on your story!</p>
            <div className='flex gap-5 mt-10'>
                <Button variant={'outline'} size={'lg'}>Watch Video <Video /></Button>
                {
                    user ?
                        <Link to='/workspace'>
                            <Button size={'lg'}>Go to Workspace</Button>
                        </Link>
                        : <SignInButton mode='modal'>
                            <Button size={'lg'}>Get Started</Button>
                        </SignInButton>
                }
            </div>
            <div className="relative max-w-3xl mt-14">
                <h2 className='text-center my-4'>Watch how to create PPT</h2>
                <HeroVideoDialog
                    className="block dark:hidden"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Hero Video"
                />
                <HeroVideoDialog
                    className="hidden dark:block"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                    thumbnailAlt="Hero Video"
                />
            </div>
        </div>
    )
}

export default Hero
