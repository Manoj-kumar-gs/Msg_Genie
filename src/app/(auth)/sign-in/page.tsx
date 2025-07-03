'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { signInSchema } from "@/schemas/signInSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { toast } from 'react-toastify';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from 'lucide-react';
import Link from "next/link"


const page = () => {
  const [isSubmiting, setIsSubmiting] = useState(false)

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

const onSubmit = async (data: z.infer<typeof signInSchema>) => {
  setIsSubmiting(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      console.log(result)
  
      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast('Incorrect username or password');
        } else {
          toast(`${result.error}`);
        }
      }
  
      if (result?.url) {
        router.replace('/dashboard');
      }
    } catch (error) {
      const axiosError = error as AxiosError
      console.log("axioserror : ", axiosError)
      toast.error(`Error signing in`)
    }finally{
      setIsSubmiting(false)
    }
  };


  return (
    <div className="bg-white flex justify-center items-center mt-15">
      <div className="bg-slate-50 p-8 flex flex-col justify-center items-center rounded-lg">
        <h1 className="text-4xl font-bold mb-20">Try Message With AI</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full flex flex-col justify-center items-center">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input className="w-[80%]" placeholder="Enter Username/Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input className="w-[80%]" type="password" placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit" disabled={isSubmiting} className="bg-gray-950 p-3 rounded-lg text-white font-semibold cursor-pointer transition duration-200 ease-in-out active:scale-95 active:bg-gray-700 hover:shadow-md hover:shadow-gray-500">
              {isSubmiting ? (
                <>
                  <div className="flex justify-center items-center">
                    <Loader className="animate-spin" />
                    <p>Please Wait</p>
                  </div>
                </>
              ) : (
                <>
                  <p>Sign-In</p>
                </>
              )}
            </button>
            <div className="flex gap-2">
              <p>Not have an account?</p>
              <Link href={"/sign-up"} className="text-blue-500">Sign-Up</Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page
