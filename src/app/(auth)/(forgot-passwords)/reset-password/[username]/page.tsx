'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Loader } from 'lucide-react';

const Page = () => {
  const [verifying, setVerifying] = React.useState(false);
  const router = useRouter();
  const { username } = useParams() as { username: string };

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      form.setValue('newPassword', '');
      form.setValue('confirmPassword', '');
      return;
    }
    setVerifying(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/reset-password`, {
        newPassword: data.newPassword,
        identifier: username.replace('%40', '@'),
      });
      toast.success(response.data.message);
      router.push('/sign-in');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'An error occurred'
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-slate-100 px-4 h-[80vh]">
      <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Reset Your Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Please enter and confirm your new password below.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">New Password</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border-gray-300 focus-visible:ring-indigo-500"
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border-gray-300 focus-visible:ring-indigo-500"
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 cursor-pointer text-white font-medium py-2 rounded-lg shadow-md hover:shadow-cyan-500 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={verifying}
            >
              {verifying ? (
                <div className="flex justify-center items-center gap-2">
                  <Loader className="animate-spin" />
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
