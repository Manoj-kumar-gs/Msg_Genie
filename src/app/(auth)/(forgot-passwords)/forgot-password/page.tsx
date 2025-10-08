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
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const identifierSchema = z.object({
    identifier: z.string().min(1, 'Email or username is required'),
  });

  const form = useForm<z.infer<typeof identifierSchema>>({
    resolver: zodResolver(identifierSchema),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (data: { identifier: string }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(
        '/api/forgot-password',
        data
      );
      toast.success(response.data.message);
      router.push(`/verify-user/${data.identifier}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `${error.response?.data?.message || 'An error occurred'}`
        );
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
      form.setValue('identifier', '');
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-indigo-100 via-white to-slate-100 px-4 h-[80vh]">
      <div className="bg-white shadow-xl border border-slate-200 rounded-xl p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold text-indigo-700 mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your username or email to receive a verification link.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Username or Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border-gray-300 focus-visible:ring-indigo-500"
                      placeholder="Enter your username or email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 cursor-pointer text-white font-medium py-2 rounded-lg shadow-md hover:shadow-cyan-500 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
