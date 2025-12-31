
import { Button } from "../ui/button"
import { Video,  } from "lucide-react"
import { HeroVideoDialog } from "../ui/hero-video-dialog"
import { SignInButton, useUser } from "@clerk/clerk-react"
import { Link } from "react-router-dom"

function Hero() {
    const {user} = useUser();
  return (
    <div className="flex flex-col items-center justify-center mt-28 space-y-6 text-center">
     <h2 className="font-bold text-5xl">From Idea to Presentation in one presentation</h2>
     <p className="text-xl text-gray-500 max-w-2xl text-center">Use AI to effortlessly generate sleek presentations, saving time on design while ensuring a polished, professional look.</p>
     <div className="flex gap-5">
        <Button variant={'outline'} size={'lg'}>Watch Video <Video/></Button>
        {!user? <SignInButton mode="modal"><Button size={'lg'}>Get Started</Button></SignInButton>:<Link to='workspace'><Button size={'lg'}>Go to Workspace</Button></Link>}
     </div>
     <div className="relative max-w-3xl mt-14">
      <h2 className="text-center my-4">Watch now to create ai ppt</h2>
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
    </div>
  )
}

export default Hero
