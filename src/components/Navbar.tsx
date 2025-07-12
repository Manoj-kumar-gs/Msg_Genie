'use client'
import React, { useState } from 'react'
import { useSession, signOut, signIn } from 'next-auth/react'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import MsgGenie from './Logo'

const Navbar = () => {
  const router = useRouter();
  const { data, status } = useSession()

  const routingHandler = async (path: string) => {
    router.push(path);
  };

  return (
   <nav className='bg-black text-white w-full md:h-[10vh] flex flex-col gap-5 md:flex-row justify-between items-center  md:px-5 py-3'>

      <div className='flex justify-between items-center w-[95%] md:w-auto'>
        <div className='flex justify-center items-center'>
         <MsgGenie onClick={() => routingHandler('/')} />
        </div>
 
        {data ? (
          <button
            onClick={() => signOut()}
            className='md:hidden flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold bg-indigo-600 shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer hover:shadow-cyan-500'
          >
            <span>Log Out</span>
            <LogOut size={18} />
          </button>
        ) : (
          <div className='flex gap-2 justify-center items-center md:hidden'>
            <button
              onClick={() => routingHandler('/sign-in')}
              className='flex items-center gap-2 px-2 py-1 md:px-6 md:py-2 rounded-lg text-white font-semibold shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer bg-indigo-600 hover:shadow-cyan-500'
            >
              Sign In
            </button>
            <button
              onClick={() => routingHandler('/sign-up')}
              className='flex items-center gap-2 px-2 py-1 md:px-6 md:py-2 rounded-lg text-white font-semibold shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer bg-indigo-600 hover:shadow-cyan-500'
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      <div className='font-bold flex flex-col justify-center items-center'>
        <div className='flex justify-center items-center gap-2'>
          <p className='text-lg'>Hey</p>
          <h2
            className='text-[20px] cursor-pointer'
            onClick={() => routingHandler('/dashboard')}
          >
            {data ? data?.username : 'There!'}
          </h2>
        </div>
      </div>

      {data ? (
        <button
          onClick={() => signOut()}
          className='hidden md:flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold bg-indigo-600 shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer hover:shadow-cyan-500'
        >
          <span>Log Out</span>
          <LogOut size={18} />
        </button>
      ) : (
        <div className='hidden md:flex gap-2 justify-center items-center'>
          <button
            onClick={() => routingHandler('/sign-in')}
            className='flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer bg-indigo-600 hover:shadow-cyan-500'
          >
            Sign In
          </button>
          <button
            onClick={() => routingHandler('/sign-up')}
            className='flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer bg-indigo-600 hover:shadow-cyan-500'
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar