'use client'
import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

const Navbar = () => {
  const { data, status } = useSession()
  console.log(data, status)
  return (
    <nav className='bg-black text-white w-[100vw] h-[10vh] flex justify-between items-center px-9'>
      <div className='text-3xl font-extrabold shadow-md shadow-indigo-500 w-fit'>ChatwithAI</div>
      <div className='text-2xl font-bold flex flex-col justify-center items-center'><p>Welcome To ChatWithAI</p>
        {data?.username}</div>
      {data ?
        (<>
          <Link href={"/sign-in"}>
            <button
              onClick={() => {
                signOut();
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 hover:scale-105 shadow-md transition duration-200 ease-in-out transform active:scale-95 cursor-pointer hover:shadow-cyan-500`}
            >
                <span>Log Out</span>
                <LogOut size={18} />
            </button>
          </Link>

        </>) :
        (<>
          <div className='flex gap-4 justify-center items-center'>
            <Link href={"/sign-in"}>
              <div className='flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition duration-200 ease-in-out transform active:scale-95 cursor-pointer bg-indigo-600 hover:bg-indigo-700 hover:shadow-cyan-500'>Sign In</div>
            </Link>
            <Link href={"/sign-up"}>
              <div className='flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition duration-200 ease-in-out transform active:scale-95 cursor-pointer bg-indigo-600 hover:bg-indigo-700 hover:shadow-cyan-500'>Sign Up</div>
            </Link>
          </div>
        </>)}
    </nav>
  )
}

export default Navbar