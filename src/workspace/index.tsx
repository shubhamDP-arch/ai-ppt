import { Button } from '@/components/ui/button';
import { firebaseDb } from '@/config/FirebaseConfig';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/clerk-react'
import Header  from '@/components/custom/header';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import PromptBox from '@/components/custom/PromptBox';
import MyProjects from '@/components/custom/MyProjects';

function Workspace() {
  const {user, isLoaded} = useUser();
  const {userDetail, setUserDetail} = useContext(UserDetailContext);

  useEffect(()=>{
    user &&CreateNewUser()
  }, [user])
  const CreateNewUser=async ()=>{
    const docRef = doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress??'')
    const docSnap = await getDoc(docRef);
    
    if(docSnap.exists()){
      console.log("Document data:", docSnap.data());
      setUserDetail(docSnap.data());
    }
    else{
      const data= {
        fullname:user?.fullName, email: user?.primaryEmailAddress?.emailAddress, created:new Date(), credits:2
      }
      await setDoc(doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress??''), {...data});
      setUserDetail(data);
    }
    
  }
  if(!user){
    return <div>Please sign in to the workspace
      <Link to={'/'}><Button>Sign In</Button> </Link>
    </div>
    
  }
  return (


    <div>
            <Header/>
            {location.pathname==='/workspace' && <PromptBox/>}
            {location.pathname ==='/workspace' && <MyProjects/>}
            <Outlet/>
    </div>

  )
}

export default Workspace