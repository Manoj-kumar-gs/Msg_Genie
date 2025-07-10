'use client';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const page = () => {
  const {username} = useParams() as {username: string};
  console.log("Username from params:", username);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  const verificationCodeSchema = z.object({
    verificationCode: z.string()
      .length(6, "Verification code must be 6 characters")
      .min(1, "Verification code is required")
  });
  const form = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    mode: 'onChange',
    defaultValues: {
      verificationCode: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof verificationCodeSchema>) => {
    console.log("Form submitted with data:", data);
    setVerifying(true)
    try {
      const verificationCode = data.verificationCode;
      const response = await axios.post(`/api/check-user-isValid/`,
        {
          verificationCode,
          identifier : username.replace('%40', '@')
        });
      router.push(`/reset-password/${username}`);
    } catch (error: any) {
      console.log("Error submitting form:", error);
      toast.error(`${error.response?.data?.message || "An error occurred"}`);
    } finally {
      setVerifying(false);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center gap-10 h-[80vh] w-[99vw] space-y-4">
      <div className='flex flex-col justify-center items-center space-y-2'>
      <div className='text-2xl font-bold'>Verification Page</div>
      <p className='font-semibold'>Please enter the verification code sent to your email.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-start w-[70%]">
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem className="w-full flex justify-center items-start flex-col gap-4">
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Enter Verification Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit" className={`bg-gray-950 p-3 rounded-lg text-white font-semibold cursor-pointer transition duration-200 ease-in-out active:scale-95 active:bg-gray-700 hover:shadow-md hover:shadow-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`} disabled={verifying}>
            {verifying ? "Verifying..." : "Verify"}
          </button>
        </form>
      </Form>

    </div>
  )
}

export default page
