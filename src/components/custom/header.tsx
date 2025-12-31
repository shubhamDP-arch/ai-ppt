
import logo from '../../assets/logo.png'
import { Button } from '../ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useLocation } from 'react-router-dom';
import {Gem } from 'lucide-react';

function Header() {
  const {user} = useUser();
  const location = useLocation();
  // useContext(UserDetailContext);
  return (
    <div className='flex items-center justify-between px-10 bg-gray shadow'>
        <img src={logo} alt="logo" width={130} height={130} />
        {!user? <SignInButton><Button>Get Started</Button></SignInButton>:<div className='flex gap-5 items-center'><UserButton />{location.pathname.includes('workspace')?<div className='flex gap-2 items-center p-2 px-3 bg-orange-100 rounded-2xl'><Gem/></div>:<Link to="/workspace"><Button>Go to workspace</Button></Link>}</div>}
    </div>
  )
}

export default Header