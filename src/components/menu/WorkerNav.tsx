"use client"
import { signOut, useSession } from 'next-auth/react'
import React from 'react'


const WorkerNav = () => {
const   { data: session } = useSession()

  return (
    <>
    <nav className="bg-[#f7f7f8] h-screen  min-w-[250px] py-6 px-4 font-[sans-serif]">
   
    <h1 className='font-bold pl-6 text-3xl uppercase text-blue-700'>{session?.user.name}</h1>

    <div className="overflow-auto py-6 h-full mt-4">
   
      <ul className="space-y-1">
        <li>
          <a 
            className="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-4"
              viewBox="0 0 512 512">
              <path
                d="M197.332 170.668h-160C16.746 170.668 0 153.922 0 133.332v-96C0 16.746 16.746 0 37.332 0h160c20.59 0 37.336 16.746 37.336 37.332v96c0 20.59-16.746 37.336-37.336 37.336zM37.332 32A5.336 5.336 0 0 0 32 37.332v96a5.337 5.337 0 0 0 5.332 5.336h160a5.338 5.338 0 0 0 5.336-5.336v-96A5.337 5.337 0 0 0 197.332 32zm160 480h-160C16.746 512 0 495.254 0 474.668v-224c0-20.59 16.746-37.336 37.332-37.336h160c20.59 0 37.336 16.746 37.336 37.336v224c0 20.586-16.746 37.332-37.336 37.332zm-160-266.668A5.337 5.337 0 0 0 32 250.668v224A5.336 5.336 0 0 0 37.332 480h160a5.337 5.337 0 0 0 5.336-5.332v-224a5.338 5.338 0 0 0-5.336-5.336zM474.668 512h-160c-20.59 0-37.336-16.746-37.336-37.332v-96c0-20.59 16.746-37.336 37.336-37.336h160c20.586 0 37.332 16.746 37.332 37.336v96C512 495.254 495.254 512 474.668 512zm-160-138.668a5.338 5.338 0 0 0-5.336 5.336v96a5.337 5.337 0 0 0 5.336 5.332h160a5.336 5.336 0 0 0 5.332-5.332v-96a5.337 5.337 0 0 0-5.332-5.336zm160-74.664h-160c-20.59 0-37.336-16.746-37.336-37.336v-224C277.332 16.746 294.078 0 314.668 0h160C495.254 0 512 16.746 512 37.332v224c0 20.59-16.746 37.336-37.332 37.336zM314.668 32a5.337 5.337 0 0 0-5.336 5.332v224a5.338 5.338 0 0 0 5.336 5.336h160a5.337 5.337 0 0 0 5.332-5.336v-224A5.336 5.336 0 0 0 474.668 32zm0 0"
                data-original="#000000" />
            </svg>
            <span>Dashboard</span>
          </a>
        </li>
   
   
  
      
        <li>
          <a
            className="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-4"
              viewBox="0 0 6.35 6.35">
              <path
                d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                data-original="#000000" />
            </svg>
            <span><button onClick={() => signOut()}>Logout</button></span>
          </a>
        </li>
      </ul>
    </div>
  </nav></>
  )
}

export default WorkerNav