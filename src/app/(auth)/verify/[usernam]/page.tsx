'use client';

import axios, { AxiosError } from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ApiResponse } from '@/types/apiResponse';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifySchema } from '@/schemas/verifySchema';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';

const page = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameFromLink = params.usernam; // typo? Should be `params.username`
  const codeFromLink = searchParams.get('c');

  const [verifying, setVerifying] = useState(false);

  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: codeFromLink ?? '' },
  });

  const verifyUser = async (code: string) => {
    if (!usernameFromLink) return;
    setVerifying(true);
    try {
      const { data } = await axios.post('/api/check-user-isVerified', {
        username: usernameFromLink,
        verifyCode: { code },
      });
      toast.success(data.message);
      router.replace('/dashboard');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      toast.error(axiosErr.response?.data.message ?? 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof verifySchema>) => {
    await verifyUser(values.code);
  };

  useEffect(() => {
    if (usernameFromLink && codeFromLink) {
      verifyUser(codeFromLink);
    }
  }, [usernameFromLink, codeFromLink]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-slate-100 px-4">
      <div className="bg-white shadow-xl border border-slate-200 rounded-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Verify Your Account</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter the code sent to your email to complete verification.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border-gray-300 focus-visible:ring-indigo-500"
                      type="text"
                      placeholder="Enter 6-digit code"
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
                  Verifying...
                </div>
              ) : (
                'Verify'
              )}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
