'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { set } from 'mongoose';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { fi } from 'zod/v4/locales';

const page = () => {
  const [verifying, setVerifying] = React.useState(false);
  const router = useRouter();
  const {username} = useParams() as { username: string };
  console.log("Username from reset-password params:", username);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if(data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      form.setValue("newPassword", "");
      form.setValue("confirmPassword", "");
      return;
    }
    setVerifying(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/reset-password`, {
        newPassword: data.newPassword,
        identifier: username.replace('%40', '@')  
      });
      const result = response.data;
      toast.success(`${result.message}`);
      router.push(`/sign-in`);
    } catch (error: any) {
      toast.error(`${error.response?.data?.message || "An error occurred"}`);
    }finally {
      setVerifying(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-[80vh] w-[99vw] space-y-4">
      <div className='flex flex-col justify-center items-center space-y-2'>
      <div className='text-2xl font-bold'>Password Reset Page</div>
      <p className='font-semibold'>Please enter the New Password and Confirm Password</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-start w-[70%]">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full flex justify-center items-start flex-col gap-4">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Enter Verification Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full flex justify-center items-start flex-col gap-4">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Enter Verification Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit" className={`bg-gray-950 p-3 rounded-lg text-white font-semibold cursor-pointer transition duration-200 ease-in-out active:scale-95 active:bg-gray-700 hover:shadow-md hover:shadow-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`} disabled={verifying}>
            {verifying ? "Updating..." : "Update Password"}
          </button>
        </form>
      </Form>

    </div>
  )
}

export default page
