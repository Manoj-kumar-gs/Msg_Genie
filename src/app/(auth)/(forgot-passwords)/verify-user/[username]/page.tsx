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
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const page = () => {
  const { username } = useParams() as { username: string };
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  const verificationCodeSchema = z.object({
    verificationCode: z
      .string()
      .length(6, 'Verification code must be 6 characters'),
  });

  const form = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    mode: 'onChange',
    defaultValues: {
      verificationCode: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verificationCodeSchema>) => {
    setVerifying(true);
    try {
      const response = await axios.post(`/api/check-user-isValid/`, {
        verificationCode: data.verificationCode,
        identifier: username.replace('%40', '@'),
      });
      toast.success('Code verified successfully');
      router.push(`/reset-password/${username}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Verification failed'
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-slate-100 px-4">
      <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">
          Verify Your Identity
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Please enter the 6-digit verification code sent to your email.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border-gray-300 focus-visible:ring-indigo-500"
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
                  <Loader2 className="animate-spin" />
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
