'use client'
import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()
  const { data, status } = useSession()
  return (
    <nav className='bg-black text-white w-full h-[10vh] flex justify-between items-center px-5'>
      <Link href={'/'}><div className='text-3xl font-extrabold shadow-md shadow-indigo-500 w-fit cursor-pointer'>SuggestUsingAI</div></Link>
       <div className='font-bold flex flex-col justify-center items-center'><div className='flex justify-center items-center gap-2'><p className='text-lg'>Hey</p><h2 className='text-[22px] cursor-pointer' onClick={()=>{router.push('/dashboard')}}>{data?.username}</h2></div><p className='text-lg'>Welcome To SuggestUsingAI</p></div>
      {data ?
        (<>
          <Link href={"/sign-in"}>
            <button
              onClick={() => {
                signOut();
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold bg-indigo-600 hover:scale-105 shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer hover:shadow-cyan-500`}
            >
                <span>Log Out</span>
                <LogOut size={18} />
            </button>
          </Link>

        </>) :
        (<>
          <div className='flex gap-4 justify-center items-center'>
            <Link href={"/sign-in"}>
              <button className='flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer bg-indigo-600 hover:shadow-cyan-500'>Sign In</button>
            </Link>
            <Link href={"/sign-up"}>
              <button className='flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer bg-indigo-600 hover:shadow-cyan-500'>Sign Up</button>
            </Link>
          </div>
        </>)}
    </nav>
  )
}

export default Navbar